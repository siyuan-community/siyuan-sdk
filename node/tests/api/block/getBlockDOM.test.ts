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
import { createNestedBlocks, useNotebook } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { INestedBlocks } from "~/tests/utils/fixtures";
import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type getBlockDOM from "@/types/kernel/api/block/getBlockDOM";

const pathname = Client.api.block.getBlockDOM.pathname;

describe(pathname, () => {
    const notebook = useNotebook("getBlockDOM");
    const context = {
        validators: {} as IKernelAPIValidators,
        blocks: {} as INestedBlocks,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.blocks = await createNestedBlocks(notebook.id, "getBlockDOM");
    });

    it.for<keyof INestedBlocks>([
        "document",
        "container",
        "heading",
        "block",
    ])("%s", async (name) => {
        const payload: getBlockDOM.IPayload = { id: context.blocks[name] };
        expectPayload(context.validators, payload);

        const response = await client.getBlockDOM(payload);
        expectResponse(context.validators, response);
        expect(response.data.id).toBe(context.blocks[name]);
    });
});
