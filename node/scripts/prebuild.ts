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

/**
 * 将 *.schema.json5 转换为 *.schema.json
 * 再将 *.schema.json 转换为 *.d.ts
 * REF https://www.npmjs.com/package/@nodelib/fs.walk
 */
fsWalk.walk(
    schemas_path,
    {
        entryFilter: (entry) => entry.name.endsWith(".schema.json5"), // 仅处理 *.schema.json5 文件
    },
    (_error, entries) => {
        const promise_pool: Promise<string>[] = [];
        entries.forEach(entry => {
            promise_pool.push((async () => {
                const json5 = await asyncFs.readFile(entry.path, "utf-8"); // 读取 *.schema.json5 文件
                const schema = JSON5.parse(json5); // 解析 *.schema.json5

                /* 生成 *.schema.json 文件并写入原位置 */
                schema.$id = schema.$id.replace(/\.json5$/i, ".json"); // 替换 $id 扩展名
                const json_path = entry.path.replace(/\.schema\.json5$/i, ".schema.json"); // 生成文件路径
                fs.writeFileSync(json_path, JSON.stringify(schema, undefined, 4)); // 写入文件
                return json_path;
            })());
        })
        Promise.all(promise_pool)
            .then(paths => {
                console.log(paths);

                /**
                 * 将 *.schema.json 转换为 *.d.ts
                 */
                fsWalk.walk(
                    schemas_path,
                    {
                        entryFilter: (entry) => entry.name.endsWith(".schema.json"), // 仅处理 *.schema.json 文件
                    },
                    (_error, entries) => {
                        const promise_pool: Promise<string>[] = [];
                        entries.forEach(entry => {
                            promise_pool.push((async () => {
                                const file = path.parse(entry.path); // 文件目录信息
                                const dirs = path.parse(path.relative(schemas_path, entry.path)).dir.split(path.sep); // 分割后的目录相对路径

                                const json = await asyncFs.readFile(entry.path, "utf-8"); // 读取 *.schema.json 文件
                                const schema = JSON.parse(json); // 解析 *.schema.json

                                // REF https://www.npmjs.com/package/json-schema-to-typescript
                                const ts = await compile(
                                    schema, // JSON Schema
                                    entry.name, // 名称
                                    {
                                        additionalProperties: false, // 是否添加额外属性
                                        bannerComment, // 文件首注释
                                        cwd: file.dir, // 引用时的相对路径
                                        style: prettier, // 格式化配置
                                    }
                                );

                                const file_name = file.name.split(".").shift()!; // 主文件名
                                const ts_path = path.join(types_path, ...dirs, `${file_name}.d.ts`); // *.d.ts 文件路径
                                if (!fs.existsSync(ts_path)) {
                                    fs.mkdirSync(path.parse(ts_path).dir, { recursive: true }); // 目录不存在则创建目录
                                }
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
            })
            .finally(() => {
            });
    },
);

