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

import { describe, expect, test } from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import getChildBlocks from "@/types/kernel/api/block/getChildBlocks";

const pathname = client.Client.api.block.getChildBlocks.pathname;

interface ICase {
    name: string;
    payload: getChildBlocks.IPayload;
    debug: boolean;
    after?: (response: getChildBlocks.IResponse) => void;
}

describe.concurrent(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const cases: ICase[] = [
        /* 文档块 */
        {
            name: "/请从这里开始/编辑器/排版元素",
            payload: {
                id: "20200825162036-4dx365o",
            },
            debug: false,
        },
        /* 标题块 */
        {
            name: "/请从这里开始/编辑器/排版元素/有序、无序、任务列表",
            payload: {
                id: "20210104091228-okx8vv6",
            },
            debug: false,
        },
        /* 列表块 */
        {
            name: "/请从这里开始/编辑器/排版元素/无序列表",
            payload: {
                id: "20210104091228-tue1zbn",
            },
            debug: false,
        },
        /* 列表项 */
        {
            name: "/请从这里开始/编辑器/排版元素/无序列表",
            payload: {
                id: "20210104091228-ao01ihn",
            },
            debug: false,
        },
        /* 超级块 */
        {
            name: "/请从这里开始/编辑器/排版元素/超级块",
            payload: {
                id: "20210604234955-651jbge",
            },
            debug: false,
        },
        /* 引述块 */
        {
            name: "/请从这里开始/编辑器/排版元素/引述块",
            payload: {
                id: "20210604223030-6gapuyv",
            },
            debug: false,
        },
        /* 叶子块 */
        {
            name: "/请从这里开始/编辑器/排版元素/代码块",
            payload: {
                id: "20210104091228-mwb2x54",
            },
            after: async (response) => {
                test("leaf block has't child blocks", () => {
                    expect(response.data).toHaveLength(0);
                });
            },
            debug: false,
        },
    ];
    cases.forEach((item) => {
        testKernelAPI<getChildBlocks.IPayload, getChildBlocks.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                validate: validate_payload,
            },
            request: (payload) => client.client.getChildBlocks(payload!),
            response: {
                validate: validate_response,
                test: item.after,
            },
            debug: item.debug,
        });
    });
});
