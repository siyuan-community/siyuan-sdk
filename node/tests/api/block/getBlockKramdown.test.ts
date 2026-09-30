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

import type getBlockKramdown from "@/types/kernel/api/block/getBlockKramdown";

const pathname = Client.api.block.getBlockKramdown.pathname;

describe(pathname, () => {
    const notebook = useNotebook("getBlockKramdown");
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
     * 获取块的 kramdown 并校验
     * @param id - 块 ID
     */
    async function getBlockKramdown(id: string): Promise<getBlockKramdown.IResponse> {
        const payload: getBlockKramdown.IPayload = { id };
        expectPayload(context.validators, payload);

        const response = await client.getBlockKramdown(payload);
        expectResponse(context.validators, response);
        expect(response.data.id).toBe(id);
        return response;
    }

    it("document", async () => {
        const response = await getBlockKramdown(context.document);
        for (const sample of CONSTANTS.BLOCK_SAMPLES) {
            expect(response.data.kramdown, sample.label).toContain(context.blocks[sample.type]);
        }
    });

    it.for(CONSTANTS.BLOCK_SAMPLES)("$label", async (sample) => {
        const response = await getBlockKramdown(context.blocks[sample.type]);
        expect(response.data.kramdown).toContain(`id="${context.blocks[sample.type]}"`);
    });
});
