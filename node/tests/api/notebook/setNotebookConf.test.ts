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

import type setNotebookConf from "@/types/kernel/api/notebook/setNotebookConf";

const pathname = client.Client.api.notebook.setNotebookConf.pathname;

describe(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const notebook_name = "setNotebookConf";
    testKernelAPI<setNotebookConf.IPayload, setNotebookConf.IResponse>({
        name: "main",
        payload: {
            data: {
                notebook: "", // 将使用新创建的笔记本的 ID
                conf: {
                    name: "name",
                    sort: 1,
                    icon: "12345",
                    closed: false,
                    refCreateSaveBox: "",
                    refCreateSavePath: "./refCreateSavePath/",
                    docCreateSaveBox: "",
                    docCreateSavePath: "./docCreateSavePath",
                    dailyNoteSavePath: "/dailyNoteSavePath",
                    dailyNoteTemplatePath: "/dailyNoteTemplatePath.md",
                    sortMode: 15,
                },
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
        request: (payload) => client.client.setNotebookConf(payload!),
        response: {
            validate: validate_response,
            test: async (response, payload) => {
                it("test the result of setting notebook config", async () => {
                    const res = await client.client.getNotebookConf({
                        notebook: payload!.notebook,
                    });
                    expect(response.data).toEqual(res.data.conf);
                    expect(response.data).toEqual(payload!.conf);

                    /* 删除新建的笔记本 */
                    await client.client.removeNotebook({
                        notebook: payload!.notebook,
                    });
                });
            },
        },
    });
});
