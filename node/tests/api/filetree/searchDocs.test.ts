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
import {
    createDoc,
    uniqueName,
    useNotebook,
    waitForIndexed,
} from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type searchDocs from "@/types/kernel/api/filetree/searchDocs";

const pathname = Client.api.filetree.searchDocs.pathname;

describe(pathname, () => {
    const notebook = useNotebook("searchDocs");
    const context = {
        validators: {} as IKernelAPIValidators,
        title: uniqueName("searchDocs"), // 测试用文档标题，全局唯一
        document: "", // 测试用文档 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.document = await createDoc(notebook.id, `/${context.title}`);
        await waitForIndexed([context.document]);
    });

    /**
     * 搜索文档并校验
     * @param payload - 请求体
     * @returns 搜索结果中的文档路径列表，格式为 `笔记本 ID/文档路径`
     */
    async function search(payload: searchDocs.IPayload): Promise<string[]> {
        expectPayload(context.validators, payload);

        const response = await client.searchDocs(payload);
        expectResponse(context.validators, response);
        return response.data.map((doc) => `${doc.box}${doc.path}`);
    }

    it("flashcard: undefined", async () => {
        const paths = await search({ k: context.title });
        expect(paths).toContain(`${notebook.id}/${context.document}.sy`);
    });

    it("flashcard: false", async () => {
        const paths = await search({ k: context.title, flashcard: false });
        expect(paths).toContain(`${notebook.id}/${context.document}.sy`);
    });

    it("flashcard: true", async () => {
        /* 测试文档中没有闪卡 */
        const paths = await search({ k: context.title, flashcard: true });
        expect(paths).not.toContain(`${notebook.id}/${context.document}.sy`);
    });
});
