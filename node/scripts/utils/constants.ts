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
import path from "path";
import TOML from "@ltd/j-toml";
import quicktype from "quicktype-core";

/* prettier 配置文件路径 */
export const PRETTIERRC_PATH = path.resolve(process.cwd(), "./../.prettierrc.toml");
/* prettier 配置文件文本 */
export const PRETTIERRC = fs.readFileSync(PRETTIERRC_PATH, "utf-8");
/* prettier 配置 */
export const PRETTIER = TOML.parse(PRETTIERRC, { bigint: false });
// console.log(prettier);

/* schema 目录路径 */
export const SCHEMAS_DIR_PATH = path.resolve(process.cwd(), "./../schemas");
/* kernel 相关 schema 目录路径 */
export const KERNEL_SCHEMAS_DIR_PATH = path.resolve(SCHEMAS_DIR_PATH, "kernel");

/* types 目录路径 */
export const TYPES_DIR_PATH = path.resolve(process.cwd(), "./src/types");
/* kernel 相关 types 目录路径 */
export const KERNEL_TYPES_DIR_PATH = path.resolve(TYPES_DIR_PATH, "kernel");

export const LICENSE = `/**
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

/* quicktype 相关配置 */
export const QUICKTYPE_OPTIONS: Partial<quicktype.Options> = {
    lang: new quicktype.TypeScriptTargetLanguage(), // 目标语言
    alphabetizeProperties: false, // 是否按照属性名排序
    allPropertiesOptional: false, // 是否将所有属性设置为可选项
    // REF https://github.com/quicktype/quicktype/blob/master/packages/quicktype-core/src/language/TypeScriptFlow.ts
    rendererOptions: {
        "just-types": true, // 仅生成类型定义
        "nice-property-names": true, // 优化属性名
    }, // 渲染器选项
    indentation: " ".repeat(PRETTIER.tabWidth as number), // 缩进
} as const;
