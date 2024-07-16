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
import path from "node:path";
import process from "node:process";

import TOML from "@ltd/j-toml";
import quicktype from "quicktype-core";

/* prettier 配置文件路径 */
export const PRETTIERRC_PATH = path.resolve(process.cwd(), "./../.prettierrc.toml");
/* prettier 配置文件文本 */
export const PRETTIERRC = fs.readFileSync(PRETTIERRC_PATH, "utf-8");
/* prettier 配置 */
export const PRETTIER = TOML.parse(PRETTIERRC, { bigint: false }) as Record<string, unknown>;
// console.log(prettier);

/* schema 目录路径 */
export const SCHEMAS_DIR_PATH = path.resolve(process.cwd(), "./../schemas");
/* kernel 相关 schema 目录路径 */
export const SCHEMAS_DIR_PATH_KERNEL = path.resolve(SCHEMAS_DIR_PATH, "kernel");
/* manifest 相关 schema 目录路径 */
export const SCHEMAS_DIR_PATH_MANIFEST = path.resolve(SCHEMAS_DIR_PATH, "manifest");

/* types 目录路径 */
export const TYPES_DIR_PATH = path.resolve(process.cwd(), "./src/types");
/* kernel 相关 types 目录路径 */
export const TYPES_DIR_PATH_KERNEL = path.resolve(TYPES_DIR_PATH, "kernel");
/* manifest 相关 types 目录路径 */
export const TYPES_DIR_PATH_MANIFEST = path.resolve(TYPES_DIR_PATH, "manifest");

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
 * along with this program.  If not, see {@link http://www.gnu.org/licenses/}.
 */
`; // 注释

export const REGION_BEGIN_CONTENT = `// #region content`; // #region 自动生成的代码，请勿手动修改
export const REGION_END_CONTENT = `// #endregion content`; // #region 自动生成的代码，请勿手动修改

/* quicktype 相关配置 */
export const QUICKTYPE_OPTIONS: Partial<quicktype.Options> = {
    lang: new quicktype.TypeScriptTargetLanguage(), // 目标语言
    alphabetizeProperties: false, // 是否按照属性名排序
    allPropertiesOptional: false, // 是否将所有属性设置为可选项
    // REF: https://github.com/glideapps/quicktype/blob/master/packages/quicktype-core/src/language/TypeScriptFlow/language.ts
    rendererOptions: {
        "just-types": true, // 仅生成类型定义
        "nice-property-names": false, // 优化属性名
        "explicit-unions": true, // 显式命名联合类型
        "prefer-unions": true, // 使用联合字面量类型替代 enum
        "prefer-types": false, // 使用类型替代接口
        "prefer-const-values": true, // 对于具有单值的字符串枚举，使用 string 字面量类型替代 enum
        "readonly": true, // 使用只读类型成员
    }, // 渲染器选项
    indentation: " ".repeat(PRETTIER.tabWidth as number), // 缩进
} as const;
