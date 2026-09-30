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
import { createDeletedDocHistory, useNotebook } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IDocHistory } from "~/tests/utils/fixtures";
import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type getDocHistoryContent from "@/types/kernel/api/history/getDocHistoryContent";

const pathname = Client.api.history.getDocHistoryContent.pathname;

/* 测试文档的内容 */
const CONTENT = "getDocHistoryContent";

describe(pathname, () => {
    const notebook = useNotebook("getDocHistoryContent");
    const context = {
        validators: {} as IKernelAPIValidators,
        history: {} as IDocHistory, // 被删除文档的历史记录
        historyPath: "", // 历史记录文件路径
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.history = await createDeletedDocHistory(notebook.id, "/getDocHistoryContent", CONTENT);
        const response = await client.getHistoryItems({
            created: context.history.created,
            query: context.history.id,
            type: 3, // 按文档 ID 检索
        });
        context.historyPath = response.data.items[0]!.path;
    });

    it.for<{ name: string; k?: string }>([
        { name: "history without keyword" },
        { name: "history with keyword", k: CONTENT },
    ])("$name", async ({ k }) => {
        const payload: getDocHistoryContent.IPayload = {
            historyPath: context.historyPath,
            k,
        };
        expectPayload(context.validators, payload);

        const response = await client.getDocHistoryContent(payload);
        expectResponse(context.validators, response);
        expect(response.data.id).toBe(context.history.id);
        expect(response.data.content).toContain(CONTENT);
    });
});
