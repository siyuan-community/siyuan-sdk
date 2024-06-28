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

import type createNotebook from "@/types/kernel/api/notebook/createNotebook";

const pathname = client.Client.api.notebook.createNotebook.pathname;

describe(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const notebook_name = "createNotebook";
    testKernelAPI<createNotebook.IPayload, createNotebook.IResponse>({
        name: "main",
        payload: {
            data: {
                name: notebook_name,
            },
            validate: validate_payload,
        },
        request: (payload) => client.client.createNotebook(payload!),
        response: {
            validate: validate_response,
            test: async (response) => {
                it("test the result of creating a notebook", async () => {
                    const res = await client.client.getNotebookConf({
                        notebook: response.data.notebook.id,
                    });
                    expect(res.data.name).toEqual(notebook_name);
                    expect(res.data.conf.name).toEqual(notebook_name);

                    /* 删除测试用的笔记本 */
                    await client.client.removeNotebook({
                        notebook: res.data.box,
                    });
                });
            },
        },
    });
});
