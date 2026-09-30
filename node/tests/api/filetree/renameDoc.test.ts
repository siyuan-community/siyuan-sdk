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

import type renameDoc from "@/types/kernel/api/filetree/renameDoc";

const pathname = Client.api.filetree.renameDoc.pathname;

describe(pathname, () => {
    const notebook = useNotebook("renameDoc");
    const context = {
        validators: {} as IKernelAPIValidators,
        document: "", // 测试用文档 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.document = await createDoc(notebook.id, "/renameDoc", "# renameDoc\n");
    });

    it("main", async () => {
        const payload: renameDoc.IPayload = {
            notebook: notebook.id,
            path: `/${context.document}.sy`,
            title: "renameDoc-new",
        };
        expectPayload(context.validators, payload);

        const response = await client.renameDoc(payload);
        expectResponse(context.validators, response);

        const hpath = await client.getHPathByPath({ notebook: payload.notebook, path: payload.path });
        expect(hpath.data).toBe("/renameDoc-new");
    });
});
