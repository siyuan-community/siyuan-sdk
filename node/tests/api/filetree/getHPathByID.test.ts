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

import type getHPathByID from "@/types/kernel/api/filetree/getHPathByID";

const pathname = client.Client.api.filetree.getHPathByID.pathname;

describe(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const notebook_name = "getHPathByID";
    const hpath = "/getHPathByID";
    const markdown = "# getHPathByID\n";
    testKernelAPI<getHPathByID.IPayload, getHPathByID.IResponse>({
        name: "main",
        payload: {
            data: {
                id: "", // 将使用新创建的文档的 ID
            },
            validate: validate_payload,
            test: async (payload, options) => {
                /* 新建一个笔记本以进行测试 */
                const response_createNotebook = await client.client.createNotebook({
                    name: notebook_name,
                });
                options.notebook = response_createNotebook.data.notebook.id;

                /* 新建一个文档以测试 */
                const response_createDocWithMd = await client.client.createDocWithMd({
                    notebook: options.notebook,
                    path: hpath,
                    markdown,
                });
                payload.id = response_createDocWithMd.data;
            },
        },
        request: payload => client.client.getHPathByID(payload!),
        response: {
            validate: validate_response,
            test: async (response, _payload, options) => {
                it("test the result of creating a document", async () => {
                    expect(response.data).toEqual(hpath);

                    /* 删除测试用的笔记本 */
                    await client.client.removeNotebook({
                        notebook: options.notebook,
                    });
                });
            },
        },
    });
});
