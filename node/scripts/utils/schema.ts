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

import fs from "node:fs";
import asyncFs from "node:fs/promises";
import path from "node:path";

import JSON5 from "json5";

import {
    LICENSE,
    REGION_BEGIN_CONTENT,
    REGION_END_CONTENT,
    SCHEMAS_DIR_PATH,
    TYPES_DIR_PATH,
} from "./constants";
import {
    JSONSchema2QuicktypeInputData,
    quicktypeInputData2TypeScriptInterface,
} from "./quicktype";

/**
 * 将 *.json5 路径转换为 *.json 路径
 * @param json5FilePath: *.schema.json5 文件路径
 * @return: *.schema.json 文件路径
 */
export function json5Path2jsonPath(json5FilePath: string): string {
    return json5FilePath.replace(/\.json5$/i, ".json");
}

/**
 * 将 *.schema.json5 转换为 *.schema.json
 * @param json5FilePath: *.schema.json5 文件路径
 * @return: *.schema.json 文件路径
 */
export async function json52json(json5FilePath: string): Promise<string> {
    const json5 = await asyncFs.readFile(json5FilePath, "utf-8"); // 读取 *.schema.json5 文件
    const schema = JSON5.parse(json5); // 解析 *.schema.json5

    /* 生成 *.schema.json 文件并写入原位置 */
    schema.$id = json5Path2jsonPath(schema.$id); // 替换 $id 扩展名
    const json_path = json5Path2jsonPath(json5FilePath); // 生成文件路径
    await asyncFs.writeFile(json_path, JSON.stringify(schema, undefined, 4)); // 写入文件

    return json_path;
}

/**
 * 获取文件主文件名
 * @param filePath: 文件路径
 * @return: 主文件名
 */
export function fileMainName(filePath: string): string {
    const file = path.parse(filePath); // 文件目录信息
    const file_main_name = file.name.split(".").shift()!; // 主文件名
    return file_main_name;
}

/**
 * 将 *.schema.json 路径转换为 *.d.ts 路径
 * @param jsonFilePath: *.schema.json 文件路径
 * @return: *.d.ts 文件路径
 */
export function jsonPath2typesPath(jsonFilePath: string): string {
    const file_main_name = fileMainName(jsonFilePath); // 主文件名
    const dirs = path.parse(path.relative(SCHEMAS_DIR_PATH, jsonFilePath)).dir.split(path.sep); // 分割后的目录相对路径
    const ts_path = path.join(TYPES_DIR_PATH, ...dirs, `${file_main_name}.d.ts`); // *.d.ts 文件路径
    return ts_path;
}

/**
 * 将 *.schema.json 转换为 *.d.ts
 * @param jsonFilePath: *.schema.json 文件路径
 * @return: *.d.ts 文件路径
 */
export async function json2types(jsonFilePath: string): Promise<string> {
    const file_main_name = fileMainName(jsonFilePath); // 主文件名

    const json = await asyncFs.readFile(jsonFilePath, "utf-8"); // 读取 *.schema.json 文件

    const input_data = await JSONSchema2QuicktypeInputData({
        name: `I${file_main_name.charAt(0).toUpperCase()}${file_main_name.substring(1)}`,
        schema: json,
    })
    const ts = await quicktypeInputData2TypeScriptInterface(input_data);

    const ts_path = jsonPath2typesPath(jsonFilePath); // *.d.ts 文件路径
    if (!fs.existsSync(ts_path)) {
        fs.mkdirSync(path.parse(ts_path).dir, { recursive: true }); // 目录不存在则创建目录
    }
    fs.writeFileSync(ts_path, [
        LICENSE,
        REGION_BEGIN_CONTENT,
        ...ts.lines,
        REGION_END_CONTENT,
        "",
    ].join("\n"));
    return ts_path;
}
