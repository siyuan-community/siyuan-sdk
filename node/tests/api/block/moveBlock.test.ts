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

import type moveBlock from "@/types/kernel/api/block/moveBlock";

const pathname = Client.api.block.moveBlock.pathname;

describe(pathname, () => {
    const notebook = useNotebook("moveBlock");
    const context = {
        validators: {} as IKernelAPIValidators,
        document: "", // 测试用文档 ID
        container: "", // 测试用容器块 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.document = await createDoc(notebook.id, "/moveBlock");
        context.container = await insertMarkdown({ parentID: context.document }, "{{{\nmoveBlock\n}}}");
    });

    /**
     * 在容器块中插入一个块，再按指定位置移动该块
     * @param position - 移动的目标位置
     * @returns 被移动的块 ID
     */
    async function move(position: Pick<moveBlock.IPayload, "parentID" | "previousID">): Promise<string> {
        const id = await insertMarkdown({ parentID: context.container }, "Paragraph block");
        const payload: moveBlock.IPayload = { id, ...position };
        expectPayload(context.validators, payload);

        const response = await client.moveBlock(payload);
        expectResponse(context.validators, response);
        return id;
    }

    /**
     * 获取块的下级块 ID 列表
     * @param id - 块 ID
     */
    async function childIDs(id: string): Promise<string[]> {
        const response = await client.getChildBlocks({ id });
        return response.data.map((child) => child.id);
    }

    it("move by parentID", async () => {
        const id = await move({ parentID: context.document });
        expect(await childIDs(context.document)).toContain(id);
        expect(await childIDs(context.container)).not.toContain(id);
    });

    it("move by previousID", async () => {
        const id = await move({ previousID: context.container });
        const ids = await childIDs(context.document);
        expect(ids[ids.indexOf(context.container) + 1]).toBe(id);
    });
});
