/**
 * Copyright (C) 2023 SiYuan Community
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import fs from "fs";
import asyncFs from "fs/promises";
import path from "path";

import TOML from "@ltd/j-toml";
import JSON5 from "json5";

import fsWalk from "@nodelib/fs.walk";
import { compile } from "json-schema-to-typescript";

const prettierrc_path = "./.prettierrc.toml";
const schemas_path = "./../schemas/kernel/";
const types_path = "./src/types/kernel/";

const prettierrc = fs.readFileSync(prettierrc_path, "utf-8");
const prettier = TOML.parse(prettierrc, { bigint: false });
// console.log(prettier);

const bannerComment = `/**
 * Copyright (C) 2023 SiYuan Community
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
`;

// REF https://www.npmjs.com/package/@nodelib/fs.walk
fsWalk.walk(
    schemas_path,
    {
        entryFilter: (entry) => entry.name.endsWith(".schema.json5"),
    },
    (_error, entries) => {
        const promise_pool: Promise<string>[] = [];
        entries.forEach(entry => {
            promise_pool.push((async () => {
                const file = path.parse(entry.path);
                const dirs = path.parse(path.relative(schemas_path, entry.path)).dir.split(path.sep);

                const json5 = await asyncFs.readFile(entry.path, "utf-8");
                const schema = JSON5.parse(json5);

                /* 生成 *.schema.json 文件并写入原位置 */
                fs.writeFileSync(entry.path.replace(/\.schema\.json5$/i, ".schema.json"), JSON.stringify(schema, undefined, 4));

                // REF https://www.npmjs.com/package/json-schema-to-typescript
                const ts = await compile(
                    schema,
                    entry.name,
                    {
                        additionalProperties: false, // 是否添加额外属性
                        bannerComment, // 文件首注释
                        cwd: file.dir, // 引用时的相对路径
                        style: prettier, // 格式化配置
                    }
                );

                const file_name = file.name.split(".").shift()!;
                const ts_path = path.join(types_path, ...dirs, `${file_name}.d.ts`);
                fs.mkdirSync(path.parse(ts_path).dir, { recursive: true });
                fs.writeFileSync(ts_path, ts);
                return ts_path;
            })());
        })
        Promise.all(promise_pool)
            .then(paths => {
                console.log(paths);
            })
            .finally(() => {
            });
    },
);

