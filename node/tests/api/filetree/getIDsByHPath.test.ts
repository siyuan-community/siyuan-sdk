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

import { afterAll, describe, expect, it } from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import type getIDsByHPath from "@/types/kernel/api/filetree/getIDsByHPath";

const pathname = client.Client.api.filetree.getIDsByHPath.pathname;

/* 测试环境上下文 */
const context = {
    notebook: "", // 测试用笔记本的 ID
    document: [] as string[], // 测试用文档的 ID 列表
};

/* 初始化测试上下文 */
async function initContext() {
    /* 创建一个测试用笔记本 */
    const response_createNotebook = await client.client.createNotebook({
        name: "getIDsByHPath",
    });
    context.notebook = response_createNotebook.data.notebook.id;

    /* 创建一个测试用文档 */
    let count = 5;
    while (count--) {
        const response_createDocWithMd = await client.client.createDocWithMd({
            notebook: context.notebook,
            markdown: "",
            path: "/getIDsByHPath",
        });
        context.document.push(response_createDocWithMd.data);
    }
    return context;
}

interface ICase {
    name: string;
    payload: getIDsByHPath.IPayload;
    after?: (response: getIDsByHPath.IResponse, payload: getIDsByHPath.IPayload) => void;
    debug: boolean;
}

describe.concurrent(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const context = await initContext();

    /* 测试各种块的插入 */
    const cases: ICase[] = [];
    cases.push({
        name: `getIDsByHPath/getIDsByHPath`,
        payload: {
            notebook: context.notebook,
            path: "/getIDsByHPath",
        },
        after: (response) => {
            it("test document ID list", () => {
                const ids_set_1 = new Set<string>(context.document);
                const ids_set_2 = new Set<string>(response.data);
                expect.soft(ids_set_1.size, "document ID list length").toEqual(ids_set_2.size);
                ids_set_1.forEach((id) => {
                    expect.soft(ids_set_2.has(id), `document ID ${id}`).toBeTruthy();
                });
            });
        },
        debug: false,
    });

    cases.forEach((item) => {
        testKernelAPI<getIDsByHPath.IPayload, getIDsByHPath.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                validate: validate_payload,
            },
            request: payload => client.client.getIDsByHPath(payload!),
            response: {
                validate: validate_response,
                test: item.after,
            },
            debug: item.debug,
        });
    });
});

// REF: https://cn.vitest.dev/api/#afterall
afterAll(async () => {
    /* 删除测试用笔记本 */
    await client.client.removeNotebook({
        notebook: context.notebook,
    });
});
