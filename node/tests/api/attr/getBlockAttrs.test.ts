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
import { appendMarkdown, createDoc, useNotebook } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type getBlockAttrs from "@/types/kernel/api/attr/getBlockAttrs";

const pathname = Client.api.attr.getBlockAttrs.pathname;

describe(pathname, () => {
    const notebook = useNotebook("getBlockAttrs");
    const context = {
        validators: {} as IKernelAPIValidators,
        block: "", // 带有自定义属性的块 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        const document = await createDoc(notebook.id, "/getBlockAttrs");
        context.block = await appendMarkdown(document, "getBlockAttrs");
        await client.setBlockAttrs({
            id: context.block,
            attrs: { "custom-test": "getBlockAttrs" },
        });
    });

    it("main", async () => {
        const payload: getBlockAttrs.IPayload = { id: context.block };
        expectPayload(context.validators, payload);

        const response = await client.getBlockAttrs(payload);
        expectResponse(context.validators, response);
        expect(response.data).toMatchObject({
            "id": context.block,
            "custom-test": "getBlockAttrs",
        });
    });
});
