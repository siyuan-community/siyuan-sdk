// Copyright (C) 2024 SiYuan Community
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

// REF: https://eslint.org/docs/latest/integrate/nodejs-api

import { Linter } from "eslint";

import eslintConfig from "./../../eslint.config.js";

export const linter = new Linter();

/**
 * 格式化代码
 * @param code 代码文本
 * @param filename 代码文件名
 * @returns 格式化后的代码文本, 若格式化失败则返回 null
 */
export async function format(code: string, filename?: string): Promise<string | null> {
    try {
        const config = await eslintConfig.toConfigs();
        const result = linter.verifyAndFix(code, config, filename);
        return result.output;
    }
    catch (error) {
        void error;
        return null;
    }
}
