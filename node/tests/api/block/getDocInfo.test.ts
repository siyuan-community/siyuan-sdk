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

import {
    afterAll,
    describe,
    expect,
    test,
} from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import getDocInfo from "@/types/kernel/api/block/getDocInfo";

const pathname = client.Client.api.block.getDocInfo.pathname;

/* 测试环境上下文 */
const context = {
    notebook: "", // 测试用笔记本的 ID
    document: "", // 测试用文档的 ID
    block: "", // 测试用的块 ID
};

/* 初始化测试上下文 */
async function initContext() {
    /* 创建一个测试用笔记本 */
    const response_createNotebook = await client.client.createNotebook({
        name: "getDocInfo",
    });
    context.notebook = response_createNotebook.data.notebook.id;

    /* 创建一个测试用文档 */
    const response_createDocWithMd = await client.client.createDocWithMd({
        notebook: context.notebook,
        markdown: "",
        path: "/getDocInfo",
    });
    context.document = response_createDocWithMd.data;

    /* 插入一个测试用容器块 */
    const response_getDocInfo = await client.client.appendBlock({
        dataType: "markdown",
        data: "getDocInfo",
        parentID: context.document,
    });
    context.block = response_getDocInfo.data[0].doOperations[0].id;

    return context;
}

interface ICase {
    name: string,
    payload: getDocInfo.IPayload,
    debug: boolean,
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
    const cases: ICase[] = [
        {
            name: "id: document",
            payload: {
                id: context.document,
            },
            debug: true,
        },
        {
            name: "id: block",
            payload: {
                id: context.block,
            },
            debug: true,
        },
    ];
    cases.forEach(item => {
        testKernelAPI<getDocInfo.IPayload, getDocInfo.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                validate: validate_payload,
            },
            request: (payload) => client.client.getDocInfo(payload!),
            response: {
                validate: validate_response,
                test: (response, payload) => {
                    test("test response data", () => {
                        expect.soft(
                            response.data.id,
                            "data.id"
                        ).toEqual(payload.id);
                        expect.soft(
                            response.data.rootID,
                            "data.rootID"
                        ).toEqual(context.document);
                        expect.soft(
                            response.data.name,
                            "data.name"
                        ).toEqual("getDocInfo");
                        expect.soft(
                            response.data.refCount,
                            "data.refCount"
                        ).toEqual(0);
                        expect.soft(
                            response.data.subFileCount,
                            "data.subFileCount"
                        ).toEqual(0);
                        expect.soft(
                            response.data.refIDs,
                            "data.refIDs"
                        ).toHaveLength(0);
                        expect.soft(
                            response.data.icon,
                            "data.icon"
                        ).toEqual("");

                        expect.soft(
                            response.data.ial,
                            "data.ial"
                        ).toMatchObject({
                            id: context.document,
                            title: "getDocInfo",
                        });
                    });
                },
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
