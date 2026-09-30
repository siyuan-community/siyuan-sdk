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

import type foldBlock from "@/types/kernel/api/block/foldBlock";

const pathname = Client.api.block.foldBlock.pathname;

describe(pathname, () => {
    const notebook = useNotebook("foldBlock");
    const context = {
        validators: {} as IKernelAPIValidators,
        document: "", // 测试用文档 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.document = await createDoc(notebook.id, "/foldBlock");
    });

    it.for([
        "Paragraph block", // 段落块
        "# Heading block", // 标题块
    ])("fold: %s", async (markdown) => {
        const id = await insertMarkdown({ parentID: context.document }, markdown);
        const payload: foldBlock.IPayload = { id };
        expectPayload(context.validators, payload);

        const response = await client.foldBlock(payload);
        expectResponse(context.validators, response);

        /* 块的 IAL 中记录了折叠状态 */
        const attrs = await client.getBlockAttrs({ id });
        expect(attrs.data.fold).toBe("1");
    });
});
