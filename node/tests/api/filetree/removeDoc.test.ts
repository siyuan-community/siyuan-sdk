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

import type removeDoc from "@/types/kernel/api/filetree/removeDoc";

const pathname = Client.api.filetree.removeDoc.pathname;

describe(pathname, () => {
    const notebook = useNotebook("removeDoc");
    const context = {
        validators: {} as IKernelAPIValidators,
        document: "", // 测试用文档 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.document = await createDoc(notebook.id, "/removeDoc", "# removeDoc\n");
    });

    it("main", async () => {
        const payload: removeDoc.IPayload = {
            notebook: notebook.id,
            path: `/${context.document}.sy`,
        };
        expectPayload(context.validators, payload);

        const response = await client.removeDoc(payload);
        expectResponse(context.validators, response);

        /* 笔记本中不再包含该文档 */
        const docs = await client.listDocsByPath({ notebook: notebook.id, path: "/" });
        expect(docs.data.files.map((file) => file.id)).not.toContain(context.document);
    });
});
