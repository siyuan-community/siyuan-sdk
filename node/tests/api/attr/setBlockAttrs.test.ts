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

import type setBlockAttrs from "@/types/kernel/api/attr/setBlockAttrs";

const pathname = Client.api.attr.setBlockAttrs.pathname;

describe(pathname, () => {
    const notebook = useNotebook("setBlockAttrs");
    const context = {
        validators: {} as IKernelAPIValidators,
        document: "", // 测试用文档 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.document = await createDoc(notebook.id, "/setBlockAttrs");
    });

    /**
     * 设置块属性并校验
     * @param payload - 请求体
     */
    async function setBlockAttrs(payload: setBlockAttrs.IPayload): Promise<void> {
        expectPayload(context.validators, payload);
        const response = await client.setBlockAttrs(payload);
        expectResponse(context.validators, response);
    }

    it("set block attr", async () => {
        const id = await appendMarkdown(context.document, "set block attr");
        await setBlockAttrs({
            id,
            attrs: { "custom-test-set": "1" },
        });

        const response = await client.getBlockAttrs({ id });
        expect(response.data["custom-test-set"]).toBe("1");
    });

    it("delete block attr", async () => {
        const id = await appendMarkdown(context.document, "delete block attr");
        await client.setBlockAttrs({
            id,
            attrs: {
                "custom-test-delete-empty": "1",
                "custom-test-delete-null": "2",
            },
        });

        await setBlockAttrs({
            id,
            attrs: {
                "custom-test-delete-empty": "",
                "custom-test-delete-null": null,
            },
        });

        const response = await client.getBlockAttrs({ id });
        expect(response.data["custom-test-delete-empty"], `delete attr by set value to ""`).toBeUndefined();
        expect(response.data["custom-test-delete-null"], `delete attr by set value to null`).toBeUndefined();
    });
});
