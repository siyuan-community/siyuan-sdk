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

import type moveDocs from "@/types/kernel/api/filetree/moveDocs";

const pathname = client.Client.api.filetree.moveDocs.pathname;

describe(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const notebook_name = "moveDocs";
    const hpaths = [
        "/path1",
        "/path1/path2",
        "/path1/path2/moveDocs",
    ];
    const markdown = "# moveDocs\n";
    const hpath = "/moveDocs";
    testKernelAPI<moveDocs.IPayload, moveDocs.IResponse>({
        name: "main",
        payload: {
            data: {
                fromPaths: [], // 将使用新创建的文档的 ID
                toNotebook: "", // 将使用新创建的笔记本的 ID
                toPath: "/",
            },
            validate: validate_payload,
            test: async (payload, options) => {
                /* 新建一个笔记本以进行测试 */
                const response_createNotebook = await client.client.createNotebook({
                    name: notebook_name,
                });
                payload.toNotebook = response_createNotebook.data.notebook.id;

                options.ids = [] as string[]; // 文档 ID 列表
                /* 新建数个文档以测试 */
                for (const hpath of hpaths) {
                    const response_createDocWithMd = await client.client.createDocWithMd({
                        notebook: payload.toNotebook,
                        path: hpath,
                        markdown,
                    });
                    options.ids.push(response_createDocWithMd.data);
                }
                payload.fromPaths.push(`/${options.ids.join("/")}.sy`);
            },
        },
        request: (payload) => client.client.moveDocs(payload!),
        response: {
            validate: validate_response,
            test: async (_response, payload, options) => {
                it("test the result of moving documents", async () => {
                    const res = await client.client.getHPathByPath({
                        notebook: payload.toNotebook,
                        path: `/${options.ids.pop()}.sy`,
                    });
                    expect(res.data).toEqual(hpath);

                    /* 删除测试用的笔记本 */
                    await client.client.removeNotebook({
                        notebook: payload.toNotebook,
                    });
                });
            },
        },
    });
});
