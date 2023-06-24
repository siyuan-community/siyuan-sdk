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
import quicktype from "quicktype-core";

const prettierrc_path = "./../.prettierrc.toml";
const schemas_path = "./../schemas/kernel/";
const types_path = "./src/types/kernel/";

const prettierrc = fs.readFileSync(prettierrc_path, "utf-8");
const prettier = TOML.parse(prettierrc, { bigint: false });
// console.log(prettier);

const alphabetizeProperties = false; // 是否按照属性名排序
const allPropertiesOptional = false; // 是否将所有属性设置为可选项
// REF https://github.com/quicktype/quicktype/blob/master/packages/quicktype-core/src/language/TypeScriptFlow.ts
const rendererOptions = {
    "just-types": true, // 仅生成类型定义
    "nice-property-names": true, // 优化属性名
}; // 渲染器选项
const indentation = " ".repeat(prettier.tabWidth as number); // 缩进
const leadingComments = `/**
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
`; // 注释

/**
 * 通过 JSON Schema 构造 quicktype 输入数据
 * @param: JSON Schema 数据定义列表
 */
async function JSONSchema2QuicktypeInputData(
    ...args: quicktype.JSONSchemaSourceData[]
): Promise<quicktype.InputData> {
    const schemaInput = new quicktype.JSONSchemaInput(new quicktype.FetchingJSONSchemaStore());

    // We could add multiple schemas for multiple types,
    // but here we're just making one type from JSON schema.
    for (const arg of args) {
        await schemaInput.addSource(arg);
    }

    const inputData = new quicktype.InputData();
    inputData.addInput(schemaInput);

    return inputData;
}

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
                                const file_name = file.name.split(".").shift()!; // 主文件名

                                const dirs = path.parse(path.relative(schemas_path, entry.path)).dir.split(path.sep); // 分割后的目录相对路径

                                const json = await asyncFs.readFile(entry.path, "utf-8"); // 读取 *.schema.json 文件

                                const input_data = await JSONSchema2QuicktypeInputData({
                                    name: `I${file_name.charAt(0).toUpperCase()}${file_name.substring(1)}`,
                                    schema: json,
                                })
                                const ts = await quicktype.quicktype({
                                    lang: new quicktype.TypeScriptTargetLanguage(),
                                    inputData: input_data,
                                    alphabetizeProperties,
                                    allPropertiesOptional,
                                    rendererOptions,
                                    indentation,
                                });

                                const ts_path = path.join(types_path, ...dirs, `${file_name}.d.ts`); // *.d.ts 文件路径
                                if (!fs.existsSync(ts_path)) {
                                    fs.mkdirSync(path.parse(ts_path).dir, { recursive: true }); // 目录不存在则创建目录
                                }
                                fs.writeFileSync(ts_path, `${leadingComments}\n${ts.lines.join("\n")}`);
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

