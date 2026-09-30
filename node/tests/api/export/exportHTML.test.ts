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

import { join } from "node:path";

import { beforeAll, describe, expect, it } from "vitest";

import { expectPayload, expectResponse } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import { env } from "~/tests/utils/env";
import { createDoc, useNotebook, useTempDir } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type exportHTML from "@/types/kernel/api/export/exportHTML";

const pathname = Client.api.export.exportHTML.pathname;

describe(pathname, () => {
    const notebook = useNotebook("exportHTML");
    const dir = useTempDir("exportHTML");
    const context = {
        validators: {} as IKernelAPIValidators,
        document: "", // 测试用文档 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.document = await createDoc(notebook.id, "/exportHTML", "exportHTML paragraph");
    });

    it("main", async () => {
        const payload: exportHTML.IPayload = {
            id: context.document,
            pdf: false,
            /* 内核直接使用该路径，因此传入测试临时目录的绝对路径 */
            savePath: join(env.workspace, dir.path),
            keepFold: true,
            merge: false,
        };
        expectPayload(context.validators, payload);

        const response = await client.exportHTML(payload);
        expectResponse(context.validators, response);
        expect(response.data.id).toBe(context.document);
        expect(response.data.content).toContain("exportHTML paragraph");
    });
});
