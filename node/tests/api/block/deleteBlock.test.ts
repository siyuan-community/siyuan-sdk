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
import { createDoc, insertMarkdown, useNotebook } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type deleteBlock from "@/types/kernel/api/block/deleteBlock";

const pathname = Client.api.block.deleteBlock.pathname;

describe(pathname, () => {
    const notebook = useNotebook("deleteBlock");
    const context = {
        validators: {} as IKernelAPIValidators,
        document: "", // 测试用文档 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.document = await createDoc(notebook.id, "/deleteBlock");
    });

    it.for([
        "Paragraph block", // 段落块
    ])("delete: %s", async (markdown) => {
        const id = await insertMarkdown({ parentID: context.document }, markdown);
        const payload: deleteBlock.IPayload = { id };
        expectPayload(context.validators, payload);

        const response = await client.deleteBlock(payload);
        expectResponse(context.validators, response);

        /* 文档中不再包含该块 */
        const children = await client.getChildBlocks({ id: context.document });
        expect(children.data.map((child) => child.id)).not.toContain(id);
    });
});
