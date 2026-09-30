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

import type getHistoryItems from "@/types/kernel/api/history/getHistoryItems";

const pathname = Client.api.history.getHistoryItems.pathname;

describe(pathname, () => {
    const notebook = useNotebook("getHistoryItems");
    const context = {
        validators: {} as IKernelAPIValidators,
        history: {} as IDocHistory, // 被删除文档的历史记录
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.history = await createDeletedDocHistory(notebook.id, "/getHistoryItems", "getHistoryItems");
    });

    /* 测试文档只有一条删除操作的历史记录 */
    it.for<{ op?: getHistoryItems.TOperationType; count: number }>([
        { count: 1 },
        { op: "all", count: 1 },
        { op: "delete", count: 1 },
        { op: "clean", count: 0 },
        { op: "update", count: 0 },
        { op: "format", count: 0 },
        { op: "sync", count: 0 },
        { op: "replace", count: 0 },
    ])("operate $op", async ({ op, count }) => {
        const payload: getHistoryItems.IPayload = {
            created: context.history.created,
            query: context.history.id,
            op,
            type: 3, // 按文档 ID 检索
        };
        expectPayload(context.validators, payload);

        const response = await client.getHistoryItems(payload);
        expectResponse(context.validators, response);
        expect(response.data.items).toHaveLength(count);
        for (const item of response.data.items) {
            expect(item.path).toContain(context.history.id);
        }
    });
});
