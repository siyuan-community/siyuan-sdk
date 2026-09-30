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

import type moveDocs from "@/types/kernel/api/filetree/moveDocs";

const pathname = Client.api.filetree.moveDocs.pathname;

describe(pathname, () => {
    const notebook = useNotebook("moveDocs");
    const context = {
        validators: {} as IKernelAPIValidators,
        documents: [] as string[], // 逐级嵌套的文档 ID 列表
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        for (const hpath of [
            "/path1",
            "/path1/path2",
            "/path1/path2/moveDocs",
        ]) {
            context.documents.push(await createDoc(notebook.id, hpath, "# moveDocs\n"));
        }
    });

    it("move a nested document to the notebook root", async () => {
        const document = context.documents.at(-1)!;
        const payload: moveDocs.IPayload = {
            fromPaths: [`/${context.documents.join("/")}.sy`],
            toNotebook: notebook.id,
            toPath: "/",
        };
        expectPayload(context.validators, payload);

        const response = await client.moveDocs(payload);
        expectResponse(context.validators, response);

        const hpath = await client.getHPathByPath({ notebook: notebook.id, path: `/${document}.sy` });
        expect(hpath.data).toBe("/moveDocs");
    });
});
