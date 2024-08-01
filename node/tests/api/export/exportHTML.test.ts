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

import { afterAll, describe } from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import type exportHTML from "@/types/kernel/api/export/exportHTML";

const pathname = client.Client.api.export.exportHTML.pathname;

const savePath = "temp/export/html";
describe.concurrent(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    await client.client.putFile({
        path: savePath,
        isDir: true,
    });

    testKernelAPI<exportHTML.IPayload, exportHTML.IResponse>({
        name: "main",
        payload: {
            data: {
                id: "20200812220555-lj3enxa", // 思源笔记用户指南/请从这里开始
                pdf: false,
                savePath,
                keepFold: true,
                merge: false,
            },
            validate: validate_payload,
        },
        request: (payload) => client.client.exportHTML(payload!),
        response: {
            validate: validate_response,
        },
        // debug: true,
    });
});

// REF: https://cn.vitest.dev/api/#afterall
afterAll(async () => {
    /* 删除测试生成的文件目录 */
    await client.client.removeFile({
        path: savePath,
    });
});
