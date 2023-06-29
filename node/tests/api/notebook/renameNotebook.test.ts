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

import renameNotebook from "@/types/kernel/api/notebook/renameNotebook";

const pathname = client.Client.api.notebook.renameNotebook.pathname;

describe(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const new_notebook_name = globalThis.crypto.randomUUID();
    testKernelAPI<renameNotebook.IPayload, renameNotebook.IResponse>({
        name: "main",
        payload: {
            data: {
                notebook: "20210808180117-czj9bvb", // 思源笔记用户指南
                name: new_notebook_name,
            },
            validate: validate_payload,
        },
        request: (payload) => client.client.renameNotebook(payload!),
        response: {
            validate: validate_response,
            test: async () => {
                test("test the status of notebook", async () => {
                    const response = await client.client.getNotebookConf({
                        notebook: "20210808180117-czj9bvb",
                    });
                    expect(response.data.name).toEqual(new_notebook_name);
                    expect(response.data.conf.name).toEqual(new_notebook_name);
                });
            },
        },
    });
});
