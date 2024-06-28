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

import { describe, expect, it } from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import type sql from "@/types/kernel/api/query/sql";

const pathname = client.Client.api.query.sql.pathname;

interface ICase {
    name: string;
    payload: sql.IPayload;
    after?: (response: sql.IResponse) => void;
    debug: boolean;
}

/**
 * 校验查询结果记录
 * @param records 查询结果列表
 * @param fields 待校验的字段列表
 */
function verifyRecords<T>(
    records: sql.IResponse["data"], // 查询结果列表
    fields: {
        name: string; // 字段名称
        expectedValues: T[]; // 字段期望值
        expected?: Array<{ [key: string]: T }>; // 字段期望值断言列表
    }[],
) {
    // REF: https://cn.vitest.dev/api/expect.html#expect-objectcontaining
    fields.forEach((field) => {
        if (field.expected === undefined) {
            field.expected = [];
            field.expectedValues.forEach((value) => field.expected!.push(expect.objectContaining({ [field.name]: value })));
        }
    });

    /* 校验查询结果长度 */
    const expected_length = Math.max(...fields.map((field) => field.expected!.length));
    // REF: https://cn.vitest.dev/api/expect.html#tohavelength
    expect(records, `records count`).toHaveLength(expected_length);

    /* 校验查询结果有效值 */
    fields.forEach((field) => {
        // REF: https://cn.vitest.dev/api/expect.html#expect-arraycontaining
        expect(records, `records field "${field.name}"`).toEqual(expect.arrayContaining(field.expected!));
    });
}

/**
 * 构造表测试用例
 */
function buildTableFieldsTestCase(
    tableName: string, // 表名
    fields: string[], // 字段列表
    debug: boolean = false, // 是否开启调试模式
): ICase {
    return {
        name: `TABLE ${tableName}`,
        payload: {
            stmt: `PRAGMA table_info('${tableName}');`,
        },
        after: async (response) => {
            it("verify all fields' name", () => {
                verifyRecords(response.data, [
                    {
                        name: "name",
                        expectedValues: fields,
                    },
                ]);
            });
        },
        debug,
    };
}

describe(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const cases: ICase[] = [
        /* 校验数据库表名 */
        {
            name: `tables`,
            payload: {
                stmt: `SELECT * FROM sqlite_master WHERE type = 'table' ORDER BY name;`,
            },
            after: async (response) => {
                it("verify all tables' name", () => {
                    verifyRecords(response.data, [
                        {
                            name: "name",
                            expectedValues: [
                                "assets",
                                "attributes",
                                "blocks",
                                "blocks_fts",
                                "blocks_fts_case_insensitive",
                                "blocks_fts_case_insensitive_config",
                                "blocks_fts_case_insensitive_content",
                                "blocks_fts_case_insensitive_data",
                                "blocks_fts_case_insensitive_docsize",
                                "blocks_fts_case_insensitive_idx",
                                "blocks_fts_config",
                                "blocks_fts_content",
                                "blocks_fts_data",
                                "blocks_fts_docsize",
                                "blocks_fts_idx",
                                "file_annotation_refs",
                                "refs",
                                "spans",
                                "stat",
                            ],
                        },
                    ]);
                });
            },
            debug: false,
        },
        /* 校验 assets 表字段名称 */
        buildTableFieldsTestCase("assets", [
            "id",
            "block_id",
            "root_id",
            "box",
            "docpath",
            "path",
            "name",
            "title",
            "hash",
        ]),
        /* 校验 attributes 表字段名称 */
        buildTableFieldsTestCase("attributes", [
            "id",
            "name",
            "value",
            "type",
            "block_id",
            "root_id",
            "box",
            "path",
        ]),
        /* 校验 blocks 表字段名称 */
        buildTableFieldsTestCase("blocks", [
            "id",
            "parent_id",
            "root_id",
            "hash",
            "box",
            "path",
            "hpath",
            "name",
            "alias",
            "memo",
            "tag",
            "content",
            "fcontent",
            "markdown",
            "length",
            "type",
            "subtype",
            "ial",
            "sort",
            "created",
            "updated",
        ]),
        /* 校验 file_annotation_refs 表字段名称 */
        buildTableFieldsTestCase("file_annotation_refs", [
            "id",
            "file_path",
            "annotation_id",
            "block_id",
            "root_id",
            "box",
            "path",
            "content",
            "type",
        ]),
        /* 校验 refs 表字段名称 */
        buildTableFieldsTestCase("refs", [
            "id",
            "def_block_id",
            "def_block_parent_id",
            "def_block_root_id",
            "def_block_path",
            "block_id",
            "root_id",
            "box",
            "path",
            "content",
            "markdown",
            "type",
        ]),
        /* 校验 spans 表字段名称 */
        buildTableFieldsTestCase("spans", [
            "id",
            "block_id",
            "root_id",
            "box",
            "path",
            "content",
            "markdown",
            "type",
            "ial",
        ]),
    ];

    cases.forEach((item) => {
        testKernelAPI<sql.IPayload, sql.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                validate: validate_payload,
            },
            request: (payload) => client.client.sql(payload!),
            response: {
                validate: validate_response,
                test: item.after,
            },
            debug: item.debug,
        });
    });
});
