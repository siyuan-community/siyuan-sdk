// Copyright (C) 2023 SiYuan Community
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

import { afterAll, describe, expect, it } from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import type getBlockInfo from "@/types/kernel/api/block/getBlockInfo";

const pathname = client.Client.api.block.getBlockInfo.pathname;

/* 测试环境上下文 */
const context = {
    notebook: "", // 测试用笔记本的 ID
    document: "", // 测试用文档的 ID
    container: "", // 测试用的容器块 ID
    heading: "", // 测试用的标题块 ID
    block: "", // 测试用的块 ID
};

/* 初始化测试上下文 */
async function initContext() {
    /* 创建一个测试用笔记本 */
    const response_createNotebook = await client.client.createNotebook({
        name: "getBlockInfo",
    });
    context.notebook = response_createNotebook.data.notebook.id;

    /* 创建一个测试用文档 */
    const response_createDocWithMd = await client.client.createDocWithMd({
        notebook: context.notebook,
        markdown: "",
        path: "/getBlockInfo",
    });
    context.document = response_createDocWithMd.data;

    /* 插入一个测试用容器块 */
    const response_container = await client.client.prependBlock({
        dataType: "markdown",
        data: "{{{\ngetBlockInfo\n}}}",
        parentID: context.document,
    });
    context.container = response_container.data[0].doOperations[0].id;

    /* 插入一个测试用标题 */
    const response_heading = await client.client.prependBlock({
        dataType: "markdown",
        data: "# getBlockInfo",
        parentID: context.container,
    });
    context.heading = response_heading.data[0].doOperations[0].id;

    /* 插入一个测试用普通块 */
    const response_block = await client.client.appendBlock({
        dataType: "markdown",
        data: "getBlockInfo",
        parentID: context.container,
    });
    context.block = response_block.data[0].doOperations[0].id;

    return context;
}

interface ICase {
    name: string;
    payload: getBlockInfo.IPayload;
    after?: (response: getBlockInfo.IResponse) => void;
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
        name: `document: ${context.document}`,
        payload: {
            id: context.document,
        },
        after: (response) => {
            it("document", () => {
                expect.soft(response.data.box).toEqual(context.notebook);
                expect.soft(response.data.path).toEqual(`/${context.document}.sy`);
                expect.soft(response.data.rootChildID).toEqual(context.document);
                expect.soft(response.data.rootID).toEqual(context.document);
                expect.soft(response.data.rootTitle).toEqual("getBlockInfo");
            });
        },
        debug: false,
    });
    cases.push({
        name: `container: ${context.container}`,
        payload: {
            id: context.container,
        },
        after: (response) => {
            it("document > container", () => {
                expect.soft(response.data.box).toEqual(context.notebook);
                expect.soft(response.data.path).toEqual(`/${context.document}.sy`);
                expect.soft(response.data.rootChildID).toEqual(context.document);
                expect.soft(response.data.rootID).toEqual(context.document);
                expect.soft(response.data.rootTitle).toEqual("getBlockInfo");
            });
        },
        debug: false,
    });
    cases.push({
        name: `heading: ${context.heading}`,
        payload: {
            id: context.heading,
        },
        after: (response) => {
            it("document > container > heading", () => {
                expect.soft(response.data.box).toEqual(context.notebook);
                expect.soft(response.data.path).toEqual(`/${context.document}.sy`);
                expect.soft(response.data.rootChildID).toEqual(context.document);
                expect.soft(response.data.rootID).toEqual(context.document);
                expect.soft(response.data.rootTitle).toEqual("getBlockInfo");
            });
        },
        debug: false,
    });
    cases.push({
        name: `block: ${context.block}`,
        payload: {
            id: context.block,
        },
        after: (response) => {
            it("document > container > heading > block", () => {
                expect.soft(response.data.box).toEqual(context.notebook);
                expect.soft(response.data.path).toEqual(`/${context.document}.sy`);
                expect.soft(response.data.rootChildID).toEqual(context.document);
                expect.soft(response.data.rootID).toEqual(context.document);
                expect.soft(response.data.rootTitle).toEqual("getBlockInfo");
            });
        },
        debug: false,
    });

    cases.forEach((item) => {
        testKernelAPI<getBlockInfo.IPayload, getBlockInfo.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                validate: validate_payload,
            },
            request: (payload) => client.client.getBlockInfo(payload!),
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
