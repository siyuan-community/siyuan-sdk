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
    describe,
    test,
    expect,
} from "vitest";

import client from "~/tests/utils/client";
import { testKernelAPI } from "~/tests/utils/test";
import { SchemaJSON } from "~/tests/utils/schema";

import removeNotebook from "@/types/kernel/api/notebook/removeNotebook";
import { KernelError } from "~/src";

const pathname = client.Client.api.notebook.removeNotebook.pathname;

describe(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const notebook_name = "notebook will be remove";

    testKernelAPI<removeNotebook.IPayload, removeNotebook.IResponse>({
        name: "main",
        payload: {
            data: {
                notebook: "", // 将使用新创建的笔记本的 ID
            },
            validate: validate_payload,
            test: async (payload) => {
                /* 新建一个笔记本以进行测试 */
                const response = await client.client.createNotebook({
                    name: notebook_name,
                });
                payload.notebook = response.data.notebook.id;
            },
        },
        request: (payload) => client.client.removeNotebook(payload!),
        response: {
            validate: validate_response,
            test: async (_response, payload) => {
                test("test the result of removing a notebook", async () => {
                    await expect(client.client.getNotebookConf({
                        notebook: payload!.notebook,
                    })).rejects.toThrowError(KernelError);
                });
            },
        },
    });
});
