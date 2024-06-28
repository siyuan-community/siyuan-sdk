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

import { afterAll, describe } from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import type deleteBlock from "@/types/kernel/api/block/deleteBlock";

const pathname = client.Client.api.block.deleteBlock.pathname;

/* 测试环境上下文 */
const context = {
    notebook: "", // 测试用笔记本的 ID
    document: "", // 测试用文档的 ID
};

/* 初始化测试上下文 */
async function initContext() {
    /* 创建一个测试用笔记本 */
    const response_createNotebook = await client.client.createNotebook({
        name: "deleteBlock",
    });
    context.notebook = response_createNotebook.data.notebook.id;

    /* 创建一个测试用文档 */
    const response_createDocWithMd = await client.client.createDocWithMd({
        notebook: context.notebook,
        markdown: "",
        path: "/deleteBlock",
    });
    context.document = response_createDocWithMd.data;

    return context;
}

interface ICase {
    name: string;
    before?: (payload: deleteBlock.IPayload) => void;
    payload: deleteBlock.IPayload;
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

    /* 测试各种块的更新 */
    const cases: ICase[] = [];
    for (const markdown of [
        "Paragraph block", // 段落块
    ]) {
        cases.push({
            name: `delete: ${markdown}`,
            before: async (payload) => {
                /* 插入一个测试用的块 */
                const response_deleteBlock = await client.client.insertBlock({
                    dataType: "markdown",
                    data: markdown,
                    parentID: context.document,
                });
                payload.id = response_deleteBlock.data[0].doOperations[0].id;
            },
            payload: {
                id: "", // 将使用新插入的块 ID
            },
            debug: false,
        });
    }
    cases.forEach((item) => {
        testKernelAPI<deleteBlock.IPayload, deleteBlock.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                validate: validate_payload,
                test: item.before,
            },
            request: (payload) => client.client.deleteBlock(payload!),
            response: {
                validate: validate_response,
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
