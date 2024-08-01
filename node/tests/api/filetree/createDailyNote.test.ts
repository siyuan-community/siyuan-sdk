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

import type createDailyNote from "@/types/kernel/api/filetree/createDailyNote";

const pathname = client.Client.api.filetree.createDailyNote.pathname;

/* 测试环境上下文 */
const context = {
    notebook: "", // 测试用笔记本的 ID
    template: "/daily note/{{now | date \"2006/01\"}}/{{now | date \"2006-01-02\"}}", // 测试用文档的路径模板
    hpath: "", // 测试用文档的路径
};

/* 初始化测试上下文 */
async function initContext() {
    /* 创建一个测试用笔记本 */
    const response_createNotebook = await client.client.createNotebook({
        name: "createDailyNote",
    });
    context.notebook = response_createNotebook.data.notebook.id;

    /* 设置 Daily Note 路径 */
    const response_getNotebookConf = await client.client.getNotebookConf({
        notebook: context.notebook,
    });
    response_getNotebookConf.data.conf.dailyNoteSavePath = context.template;
    await client.client.setNotebookConf({
        notebook: context.notebook,
        conf: response_getNotebookConf.data.conf,
    });

    /* 渲染文档路径模板 */
    const response_renderSprig = await client.client.renderSprig({
        template: context.template,
    });
    context.hpath = response_renderSprig.data;
    return context;
}

interface ICase {
    name: string;
    payload: createDailyNote.IPayload;
    after?: (response: createDailyNote.IResponse, payload?: createDailyNote.IPayload) => void;
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
        name: `unset app`,
        payload: {
            notebook: context.notebook,
        },
        after: (response) => {
            it("test Daily Note document hpath", async () => {
                const response_getHPathByID = await client.client.getHPathByID({
                    id: response.data.id,
                });
                expect(
                    response_getHPathByID.data, //
                    "test hpath",
                ).toEqual(context.hpath);
            });
        },
        debug: false,
    });

    cases.forEach((item) => {
        testKernelAPI<createDailyNote.IPayload, createDailyNote.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                validate: validate_payload,
            },
            request: (payload) => client.client.createDailyNote(payload!),
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
