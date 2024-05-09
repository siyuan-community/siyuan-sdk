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

import fsWalk from "@nodelib/fs.walk";

import {
    SCHEMAS_DIR_PATH,
    TYPES_DIR_PATH,
} from "./utils/constants";
import {
    json2types,
    json52json,
} from "./utils/schema";
import { updateTypeDefinitionFile } from "./utils/types";

/**
 * 将 *.schema.json5 转换为 *.schema.json
 * 再将 *.schema.json 转换为 *.d.ts
 * REF https://www.npmjs.com/package/@nodelib/fs.walk
 */
fsWalk.walk(
    SCHEMAS_DIR_PATH,
    {
        entryFilter: (entry) => entry.name.endsWith(".schema.json5"), // 仅处理 *.schema.json5 文件
    },
    (_error, entries) => {
        /* 将 *.schema.json5 转换为 *.schema.json */
        const promise_pool: Promise<string>[] = [];
        entries.forEach(entry => {
            promise_pool.push(json52json(entry.path));
        })
        Promise.all(promise_pool)
            .then(paths => {
                console.log(paths); // 打印转换后的 *.schema.json 文件路径

                /* 将所有 *.schema.json 文件转换为对应的 *.d.ts */
                fsWalk.walk(
                    SCHEMAS_DIR_PATH,
                    {
                        entryFilter: (entry) => entry.name.endsWith(".schema.json"), // 仅处理 *.schema.json 文件
                    },
                    (_error, entries) => {
                        /* 将 *.schema.json 转换为 *.d.ts */
                        const promise_pool: Promise<string>[] = [];
                        entries.forEach(entry => {
                            promise_pool.push(json2types(entry.path));
                        })
                        Promise.all(promise_pool)
                            .then(paths => {
                                console.log(paths); // 打印转换后的 *.d.ts 文件路径

                                /* 更新各目录下的 index.d.ts */
                                fsWalk.walk(
                                    TYPES_DIR_PATH,
                                    {
                                        entryFilter: (entry) => entry.dirent.isDirectory(), // 仅处理目录
                                    },
                                    (_error, entries) => {
                                        /* 更新目录下的 index.d.ts 文件 */
                                        const promise_pool: Promise<string>[] = [];
                                        entries.forEach(entry => {
                                            promise_pool.push(updateTypeDefinitionFile(entry.path));
                                        })
                                        Promise.all(promise_pool)
                                            .then(paths => {
                                                console.log(paths); // 打印更新的 index.d.ts 文件目录
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
            })
            .finally(() => {
            });
    },
);
