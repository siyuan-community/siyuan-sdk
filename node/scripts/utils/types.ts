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

import asyncFs from "node:fs/promises";
import { resolve } from "node:path";

import * as constants from "./constants";

/**
 * 更新指定目录的类型定义文件 index.d.ts
 * @param path: 指定目录的路径
 * @return: 该目录的类型定义文件名
 */
export async function updateTypeDefinitionFile(path: string): Promise<string> {
    if (path.endsWith("src")) {
        throw new Error("Cannot update src directory.");
    }

    const ts: string[] = [
        constants.LICENSE,
    ]; // index.d.ts 要写入的内容
    const children = await asyncFs.readdir(path, { withFileTypes: true }); // 该目录下级内容
    const dirs = children.filter((child) => child.isDirectory()); // 下级目录列表
    const files = children.filter(
        (child) =>
            child.isFile() && //
            child.name.endsWith(".d.ts") &&
            child.name !== "index.d.ts",
    ); // 下级文件列表

    ts.push(constants.REGION_BEGIN_CONTENT); // 代码内容首

    /* 导出下级目录的类型定义 */
    ts.push(`/* directories */`);
    dirs.forEach((dir) => {
        ts.push(`export * as ${dir.name} from "./${dir.name}";`);
    });

    /* 导出文件的类型定义 */
    ts.push(`\n/* files */`);
    files.forEach((file) => {
        const name = file.name.split(".").shift()!;
        switch (name) {
            case "payload":
            case "response":
                ts.push(`export * from "./${name}";`);
                break;

            default:
                ts.push(`export * as ${name} from "./${name}";`);
                break;
        }
    });

    ts.push(constants.REGION_END_CONTENT); // 代码内容尾
    ts.push(""); // 文件末尾空行

    const index_path = resolve(path, "index.d.ts");
    await asyncFs.writeFile(index_path, ts.join("\n"));
    return index_path;
}
