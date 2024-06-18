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

import type removeDoc from "@/types/kernel/api/filetree/removeDoc";

const pathname = client.Client.api.filetree.removeDoc.pathname;

describe(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const notebook_name = "removeDoc";
    const hpath = "/removeDoc";
    const markdown = "# removeDoc\n";
    testKernelAPI<removeDoc.IPayload, removeDoc.IResponse>({
        name: "main",
        payload: {
            data: {
                notebook: "", // 将使用新创建的笔记本的 ID
                path: "", // 将使用新创建的文档的 ID
            },
            validate: validate_payload,
            test: async (payload) => {
                /* 新建一个笔记本以进行测试 */
                const response_createNotebook = await client.client.createNotebook({
                    name: notebook_name,
                });
                payload.notebook = response_createNotebook.data.notebook.id;

                /* 新建一个文档以测试 */
                const response_createDocWithMd = await client.client.createDocWithMd({
                    notebook: payload.notebook,
                    path: hpath,
                    markdown,
                });
                payload.path = `/${response_createDocWithMd.data}.sy`;
            },
        },
        request: payload => client.client.removeDoc(payload!),
        response: {
            validate: validate_response,
            test: async (_response, payload) => {
                it("test the result of removing a document", async () => {
                    const doc_id = payload!.path.split("/").pop()!.split(".").shift()!;
                    const response = await client.client.exportMdContent({
                        id: doc_id,
                    });
                    expect(response.data.hPath).not.toEqual(hpath);
                    expect(response.data.content).not.toEqual(markdown);

                    /* 删除测试用的笔记本 */
                    await client.client.removeNotebook({
                        notebook: payload!.notebook,
                    });
                });
            },
        },
    });
});
