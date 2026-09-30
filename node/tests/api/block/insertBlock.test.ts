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

import type insertBlock from "@/types/kernel/api/block/insertBlock";

const pathname = Client.api.block.insertBlock.pathname;

describe(pathname, () => {
    const notebook = useNotebook("insertBlock");
    const context = {
        validators: {} as IKernelAPIValidators,
        document: "", // 测试用文档 ID
        container: "", // 测试用容器块 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.document = await createDoc(notebook.id, "/insertBlock");
        context.container = await insertMarkdown({ parentID: context.document }, "{{{\ninsertBlock\n}}}");
    });

    /**
     * 插入块并返回新块 ID
     * @param position - 插入位置
     */
    async function insert(position: Pick<insertBlock.IPayload, "nextID" | "parentID" | "previousID">): Promise<string> {
        const payload: insertBlock.IPayload = {
            dataType: "markdown",
            data: "Paragraph block",
            ...position,
        };
        expectPayload(context.validators, payload);

        const response = await client.insertBlock(payload);
        expectResponse(context.validators, response);
        return response.data[0].doOperations[0].id;
    }

    /**
     * 获取块的下级块 ID 列表
     * @param id - 块 ID
     */
    async function childIDs(id: string): Promise<string[]> {
        const response = await client.getChildBlocks({ id });
        return response.data.map((child) => child.id);
    }

    it("insert by parentID", async () => {
        const id = await insert({ parentID: context.container });
        expect(await childIDs(context.container)).toContain(id);
    });

    it("insert by previousID", async () => {
        const id = await insert({ previousID: context.container });
        const ids = await childIDs(context.document);
        expect(ids[ids.indexOf(context.container) + 1]).toBe(id);
    });

    it("insert by nextID", async () => {
        const id = await insert({ nextID: context.container });
        const ids = await childIDs(context.document);
        expect(ids[ids.indexOf(context.container) - 1]).toBe(id);
    });
});
