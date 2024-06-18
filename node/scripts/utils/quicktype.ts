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

import quicktype from "quicktype-core";

import { QUICKTYPE_OPTIONS } from "./constants";

/**
 * 通过 JSON Schema 构造 quicktype 输入数据
 * @param: JSON Schema 数据定义列表
 */
export async function JSONSchema2QuicktypeInputData(...args: quicktype.JSONSchemaSourceData[]): Promise<quicktype.InputData> {
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
 * 将 quicktype 输入数据转换为 TypeScript 接口
 * @param inputData quicktype 输入数据
 * @param options quicktype 选项
 * @return quicktype 转换结果
 */
export async function quicktypeInputData2TypeScriptInterface(
    inputData: quicktype.InputData,
    options: Partial<quicktype.Options> = QUICKTYPE_OPTIONS,
): Promise<quicktype.SerializedRenderResult> {
    return quicktype.quicktype({
        inputData,
        ...options,
    });
}
