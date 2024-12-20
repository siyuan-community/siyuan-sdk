// Copyright (C) 2023 SiYuan Community
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

/* 监听 schemas 目录下文件的变化 */

import asyncFs from "node:fs/promises";
import { parse, resolve } from "node:path";

import chokidar from "chokidar";

import * as constants from "./utils/constants.ts";
import * as logger from "./utils/logger.ts";
import { json2types, json52json, json5Path2jsonPath, jsonPath2typesPath } from "./utils/schema.ts";
import { updateTypeDefinitionFile } from "./utils/types.ts";

import type fs from "node:fs";

type EventName =
    | "add"
    | "addDir"
    | "all"
    | "change"
    | "error"
    | "raw"
    | "ready"
    | "unlink"
    | "unlinkDir";

/**
 * 处理 *.schema.json5 文件变化
 */
async function json5SchemasHandler(eventName: EventName, path: string, _stats?: fs.Stats) {
    console.debug(`\x1B[4m${eventName}\x1B[0m\t${path}`);
    try {
        switch (true) {
            case path.endsWith(".schema.json5"): {
                switch (eventName) {
                    case "add": // 添加 *.schema.json5 文件
                    case "change": {
                        // 修改 *.schema.json5 文件
                        const json_path = await json52json(path); // 更新对应的 *.schema.json 文件
                        logger.change(json_path);
                        break;
                    }
                    case "unlink": {
                        // 删除 *.schema.json5 文件
                        const json_path = json5Path2jsonPath(path);
                        await asyncFs.rm(json_path); // 删除对应的 *.schema.json 文件
                        logger.remove(json_path);
                        break;
                    }
                }
                break;
            }
        }
    }
    catch (error) {
        logger.error(path, error);
    }
}

/**
 * 处理 *.schema.json 文件变化
 */
async function jsonSchemasHandler(eventName: EventName, path: string, _stats?: fs.Stats) {
    console.debug(`\x1B[4m${eventName}\x1B[0m\t${path}`);
    try {
        switch (true) {
            case path.endsWith(".schema.json"): {
                switch (eventName) {
                    case "add": // 添加 *.schema.json 文件
                    case "change": {
                        // 修改 *.schema.json 文件
                        const types_path = await json2types(path); // 更新对应的 *.d.ts 文件
                        logger.change(types_path);
                        break;
                    }
                    case "unlink": {
                        // 删除 *.schema.json 文件
                        const types_path = jsonPath2typesPath(path);
                        await asyncFs.rm(types_path); // 删除对应的 *.d.ts 文件
                        logger.remove(types_path);
                        break;
                    }
                }
                break;
            }
        }
    }
    catch (error) {
        logger.error(path, error);
    }
}

async function typesHandler(eventName: EventName, path: string, _stats?: fs.Stats) {
    console.debug(`\x1B[4m${eventName}\x1B[0m\t${path}`);
    try {
        switch (eventName) {
            case "addDir": {
                /* 更新在其目录下的 index.d.ts 文件 */
                const index_path = await updateTypeDefinitionFile(path);
                logger.change(index_path);
                // fallthrough
            }
            case "unlinkDir": {
                /* 更新其上级目录的 index.d.ts 文件 */
                const index_path = await updateTypeDefinitionFile(resolve(path, ".."));
                logger.change(index_path);
                break;
            }
            case "add":
            case "unlink": {
                /* 更新在其目录下的 index.d.ts 文件 */
                const index_path = await updateTypeDefinitionFile(parse(path).dir);
                logger.change(index_path);
                break;
            }
        }
    }
    catch (error) {
        logger.error(path, error);
    }
}

/**
 * 监听 schemas 目录变化
 * REF: https://www.npmjs.com/package/chokidar
 */
const json5_schemas_watcher = chokidar.watch(constants.SCHEMAS_DIR_PATH, {
    ignored: /(^|[/\\])\../, // ignore dotfiles
});
const json_schemas_watcher = chokidar.watch(constants.SCHEMAS_DIR_PATH, {
    ignored: /(^|[/\\])\../, // ignore dotfiles
});
const types_watcher = chokidar.watch(constants.TYPES_DIR_PATH, {
    ignored: /(^|[/\\])\../, // ignore dotfiles
});

json5_schemas_watcher.on("all", json5SchemasHandler);
json_schemas_watcher.on("all", jsonSchemasHandler);
types_watcher.on("all", typesHandler);
