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
import { uniqueName, useNotebook } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type setNotebookConf from "@/types/kernel/api/notebook/setNotebookConf";

const pathname = Client.api.notebook.setNotebookConf.pathname;

describe(pathname, () => {
    const notebook = useNotebook("setNotebookConf");
    const context = {
        validators: {} as IKernelAPIValidators,
        sort: 0, // 笔记本原有的排序值
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.sort = (await client.getNotebookConf({ notebook: notebook.id })).data.conf.sort;
    });

    it("main", async () => {
        const payload: setNotebookConf.IPayload = {
            notebook: notebook.id,
            conf: {
                /* 名称保留测试前缀，排序值保持不变，避免影响工作空间中其他笔记本的顺序 */
                name: uniqueName("setNotebookConf-new"),
                sort: context.sort,
                icon: "12345",
                closed: false,
                refCreateSaveBox: "",
                refCreateSavePath: "./refCreateSavePath/",
                docCreateSaveBox: "",
                docCreateSavePath: "./docCreateSavePath",
                dailyNoteSavePath: "/dailyNoteSavePath",
                dailyNoteTemplatePath: "/dailyNoteTemplatePath.md",
                sortMode: 15,
            },
        };
        expectPayload(context.validators, payload);

        const response = await client.setNotebookConf(payload);
        expectResponse(context.validators, response);

        /* 响应中是保存后的完整配置，其中包括请求体中没有的字段 */
        const conf = await client.getNotebookConf({ notebook: notebook.id });
        expect(response.data).toEqual(conf.data.conf);
        expect(response.data).toMatchObject(payload.conf);
    });
});
