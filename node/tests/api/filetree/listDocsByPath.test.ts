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

import type listDocsByPath from "@/types/kernel/api/filetree/listDocsByPath";

const pathname = Client.api.filetree.listDocsByPath.pathname;

describe(pathname, () => {
    const notebook = useNotebook("listDocsByPath");
    const context = {
        validators: {} as IKernelAPIValidators,
        document: "", // 测试用文档 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.document = await createDoc(notebook.id, "/listDocsByPath");
    });

    it("path: /", async () => {
        const payload: listDocsByPath.IPayload = {
            notebook: notebook.id,
            path: "/",
        };
        expectPayload(context.validators, payload);

        const response = await client.listDocsByPath(payload);
        expectResponse(context.validators, response);
        expect.soft(response.data.box, "box").toBe(payload.notebook);
        expect.soft(response.data.path, "path").toBe(payload.path);
        expect(response.data.files, "files").toHaveLength(1);

        /* 文档大小与 .sy 文件的实际大小一致 */
        const sy = await client.getFile({ path: `/data/${notebook.id}/${context.document}.sy` }, "arraybuffer");

        const file = response.data.files[0]!;
        expect.soft(file.path, "file.path").toBe(`/${context.document}.sy`);
        expect.soft(file.name, "file.name").toBe("listDocsByPath");
        expect.soft(file.icon, "file.icon").toBe("");
        expect.soft(file.name1, "file.name1").toBe("");
        expect.soft(file.alias, "file.alias").toBe("");
        expect.soft(file.memo, "file.memo").toBe("");
        expect.soft(file.bookmark, "file.bookmark").toBe("");
        expect.soft(file.id, "file.id").toBe(context.document);
        expect.soft(file.count, "file.count").toBe(0);
        expect.soft(file.size, "file.size").toBe(sy.byteLength);
        expect.soft(file.hSize, "file.hSize").toBe(`${sy.byteLength} B`);
        expect.soft(file.subFileCount, "file.subFileCount").toBe(0);
        expect.soft(file.newFlashcardCount, "file.newFlashcardCount").toBe(0);
        expect.soft(file.dueFlashcardCount, "file.dueFlashcardCount").toBe(0);
        expect.soft(file.flashcardCount, "file.flashcardCount").toBe(0);
    });
});
