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

import CONSTANTS from "~/tests/constants";
import { expectPayload, expectResponse } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import { createBlockSamples, useNotebook } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { TBlockSampleType } from "~/tests/utils/fixtures";
import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type getChildBlocks from "@/types/kernel/api/block/getChildBlocks";

const pathname = Client.api.block.getChildBlocks.pathname;

describe(pathname, () => {
    const notebook = useNotebook("getChildBlocks");
    const context = {
        validators: {} as IKernelAPIValidators,
        document: "", // 测试用文档 ID
        blocks: {} as Record<TBlockSampleType, string>, // 各类型块的 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        Object.assign(context, await createBlockSamples(notebook.id));
    });

    /**
     * 获取下级块并校验，返回下级块的类型列表
     * @param id - 块 ID
     */
    async function getChildTypes(id: string): Promise<{ response: getChildBlocks.IResponse; types: string[] }> {
        const payload: getChildBlocks.IPayload = { id };
        expectPayload(context.validators, payload);

        const response = await client.getChildBlocks(payload);
        expectResponse(context.validators, response);
        return { response, types: response.data.map((block) => block.type) };
    }

    it("document", async () => {
        const { types } = await getChildTypes(context.document);
        /* 标题块之后还有一个段落块 */
        expect(types).toEqual([
            ...CONSTANTS.BLOCK_SAMPLES.map((sample) => sample.type),
            "p",
        ]);
    });

    it("heading", async () => {
        const { types } = await getChildTypes(context.blocks.h);
        expect(types).toEqual(["p"]);
    });

    it("super block", async () => {
        const { types } = await getChildTypes(context.blocks.s);
        expect(types).toEqual(["p", "p"]);
    });

    it("blockquote", async () => {
        const { types } = await getChildTypes(context.blocks.b);
        expect(types).toEqual(["p"]);
    });

    it("list and list item", async () => {
        const list = await getChildTypes(context.blocks.l);
        expect(list.types).toEqual(["i", "i"]);

        const item = await getChildTypes(list.response.data[0]!.id);
        expect(item.types).toEqual(["p"]);
    });

    it("leaf block has no child blocks", async () => {
        const { types } = await getChildTypes(context.blocks.c);
        expect(types).toHaveLength(0);
    });
});
