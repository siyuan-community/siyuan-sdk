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

import { beforeAll, describe, expect, it } from "vitest";

import { expectPayload, expectResponse } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import { createDoc, useNotebook } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type getIDsByHPath from "@/types/kernel/api/filetree/getIDsByHPath";

const pathname = Client.api.filetree.getIDsByHPath.pathname;

/* 测试用文档的可读路径，多个文档使用同一个路径 */
const HPATH = "/getIDsByHPath";

describe(pathname, () => {
    const notebook = useNotebook("getIDsByHPath");
    const context = {
        validators: {} as IKernelAPIValidators,
        documents: [] as string[], // 测试用文档 ID 列表
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        for (let i = 0; i < 5; i++) {
            context.documents.push(await createDoc(notebook.id, HPATH));
        }
    });

    it("documents with the same hpath", async () => {
        const payload: getIDsByHPath.IPayload = {
            notebook: notebook.id,
            path: HPATH,
        };
        expectPayload(context.validators, payload);

        const response = await client.getIDsByHPath(payload);
        expectResponse(context.validators, response);
        expect([...response.data].sort()).toEqual([...context.documents].sort());
    });
});
