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
import { useNotebook } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type createDailyNote from "@/types/kernel/api/filetree/createDailyNote";

const pathname = Client.api.filetree.createDailyNote.pathname;

/* 每日笔记的路径模板 */
const TEMPLATE = "/daily note/{{now | date \"2006/01\"}}/{{now | date \"2006-01-02\"}}";

describe(pathname, () => {
    const notebook = useNotebook("createDailyNote");
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);

        /* 设置测试笔记本的每日笔记路径 */
        const response = await client.getNotebookConf({ notebook: notebook.id });
        await client.setNotebookConf({
            notebook: notebook.id,
            conf: {
                ...response.data.conf,
                dailyNoteSavePath: TEMPLATE,
            },
        });
    });

    it("unset app", async () => {
        const payload: createDailyNote.IPayload = { notebook: notebook.id };
        expectPayload(context.validators, payload);

        const response = await client.createDailyNote(payload);
        expectResponse(context.validators, response);

        /* 文档路径由模板渲染而来，与日期有关，因此在创建后渲染同一个模板进行比较 */
        const hpath = await client.getHPathByID({ id: response.data.id });
        const rendered = await client.renderSprig({ template: TEMPLATE });
        expect(hpath.data).toBe(rendered.data);
    });
});
