// Copyright (C) 2024 SiYuan Community
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

import { beforeAll, describe, expect, it, vi } from "vitest";

import { expectResponse } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import {
    appendMarkdown,
    createDoc,
    INDEX_TIMEOUT,
    uniqueName,
    useNotebook,
} from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

const pathname = Client.api.attr.getBookmarkLabels.pathname;

describe(pathname, () => {
    const notebook = useNotebook("getBookmarkLabels");
    const context = {
        validators: {} as IKernelAPIValidators,
        label: uniqueName("bookmark"), // 测试用书签名称
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        const document = await createDoc(notebook.id, "/getBookmarkLabels");
        const block = await appendMarkdown(document, "getBookmarkLabels");
        await client.setBlockAttrs({
            id: block,
            attrs: { bookmark: context.label },
        });
    });

    it("main", async () => {
        /* 书签从数据库中查询，需要等待属性写入索引 */
        const response = await vi.waitFor(
            async () => {
                await client.flushTransaction();
                const response = await client.getBookmarkLabels();
                expect(response.data).toContain(context.label);
                return response;
            },
            { timeout: INDEX_TIMEOUT, interval: 200 },
        );
        expectResponse(context.validators, response);
    });
});
