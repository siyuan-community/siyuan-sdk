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

import { randomUUID } from "node:crypto";

import { beforeAll, describe, expect, it } from "vitest";

import { expectPayload, expectResponse } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import {
    appendMarkdown,
    createDoc,
    useNotebook,
    waitForIndexed,
} from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type fullTextSearchBlock from "@/types/kernel/api/search/fullTextSearchBlock";

const pathname = Client.api.search.fullTextSearchBlock.pathname;

/* 测试用关键词，只由字母与数字组成，避免分词影响匹配 */
const KEYWORD = `sdk${randomUUID().replaceAll("-", "").slice(0, 16)}`;

/**
 * 按搜索方式构造查询语句
 * @param method - 搜索方式
 */
function buildQuery(method: number): string {
    switch (method) {
        case 1: // 查询语法
            return `"${KEYWORD}"`;
        case 2: // SQL
            return `SELECT * FROM blocks WHERE content = '${KEYWORD}'`;
        case 3: // 正则表达式
            return `^${KEYWORD}$`;
        case 0: // 关键字
        default:
            return KEYWORD;
    }
}

/* 所有分组方式、排序方式与搜索方式的组合 */
const CASES: fullTextSearchBlock.IPayload[] = [0, 1].flatMap((groupBy) =>
    [0, 1, 2, 3, 4, 5, 6, 7].flatMap((orderBy) =>
        [0, 1, 2, 3].map((method) => ({ groupBy, orderBy, method })),
    ),
);

describe(pathname, () => {
    const notebook = useNotebook("fullTextSearchBlock");
    const context = {
        validators: {} as IKernelAPIValidators,
        block: "", // 内容为关键词的段落块 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        const document = await createDoc(notebook.id, "/fullTextSearchBlock");
        context.block = await appendMarkdown(document, KEYWORD);
        await waitForIndexed([document, context.block]);
    });

    it.for(CASES)("method: $method groupBy: $groupBy orderBy: $orderBy", async ({ groupBy, orderBy, method }) => {
        const payload: fullTextSearchBlock.IPayload = {
            method,
            groupBy,
            orderBy,
            page: 1,
            paths: [notebook.id],
            query: buildQuery(method!),
            types: {
                document: true,
                paragraph: true,
            },
        };
        expectPayload(context.validators, payload);

        const response = await client.fullTextSearchBlock(payload);
        expectResponse(context.validators, response);

        /* 按文档分组时，匹配的块位于文档块的下级 */
        const blocks = response.data.blocks.flatMap((block) => [block, ...(block.children ?? [])]);
        expect(blocks.map((block) => block.id)).toContain(context.block);
        expect(response.data.matchedBlockCount).toBe(1);
    });
});
