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

import type listDocsByPath from "@/types/kernel/api/filetree/listDocsByPath";

const pathname = client.Client.api.filetree.listDocsByPath.pathname;

/* 测试环境上下文 */
const context = {
    notebook: "", // 测试用笔记本的 ID
    document: "", // 测试用文档的 ID
};

/* 初始化测试上下文 */
async function initContext() {
    /* 创建一个测试用笔记本 */
    const response_createNotebook = await client.client.createNotebook({
        name: "listDocsByPath",
    });
    context.notebook = response_createNotebook.data.notebook.id;

    /* 创建一个测试用文档 */
    const response_createDocWithMd = await client.client.createDocWithMd({
        notebook: context.notebook,
        markdown: "",
        path: "/listDocsByPath",
    });
    context.document = response_createDocWithMd.data;
    return context;
}

interface ICase {
    name: string;
    payload: listDocsByPath.IPayload;
    after?: (response: listDocsByPath.IResponse, payload: listDocsByPath.IPayload) => void;
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
        name: `path: .`,
        payload: {
            notebook: context.notebook,
            path: "/",
        },
        after: (response, payload) => {
            it("docs", () => {
                expect.soft(response.data.box, "box").toEqual(payload.notebook);
                expect.soft(response.data.path, "path").toEqual(payload.path);
                expect(response.data.files, "files.length").toHaveLength(1);
                const file = response.data.files[0];
                expect.soft(file.path, "file.path").toEqual(`/${context.document}.sy`);
                expect.soft(file.name, "file.name").toEqual("listDocsByPath.sy");
                expect.soft(file.icon, "file.icon").toEqual("");
                expect.soft(file.name1, "file.name1").toEqual("");
                expect.soft(file.alias, "file.alias").toEqual("");
                expect.soft(file.memo, "file.memo").toEqual("");
                expect.soft(file.bookmark, "file.bookmark").toEqual("");
                expect.soft(file.id, "file.id").toEqual(context.document);
                expect.soft(file.count, "file.count").toEqual(0);
                expect.soft(file.size, "file.size").toEqual(387);
                expect.soft(file.hSize, "file.hSize").toEqual("387 B");
                expect.soft(file.subFileCount, "file.subFileCount").toEqual(0);
                expect.soft(file.newFlashcardCount, "file.newFlashcardCount").toEqual(0);
                expect.soft(file.dueFlashcardCount, "file.dueFlashcardCount").toEqual(0);
                expect.soft(file.flashcardCount, "file.flashcardCount").toEqual(0);
            });
        },
        debug: false,
    });

    cases.forEach((item) => {
        testKernelAPI<listDocsByPath.IPayload, listDocsByPath.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                validate: validate_payload,
            },
            request: (payload) => client.client.listDocsByPath(payload!),
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
