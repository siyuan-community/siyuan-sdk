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
import { createDoc, useNotebook } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type exportMdContent from "@/types/kernel/api/export/exportMdContent";

const pathname = Client.api.export.exportMdContent.pathname;

/* 测试文档的内容 */
const MARKDOWN = "## exportMdContent\n\nParagraph with **strong** text\n";

describe(pathname, () => {
    const notebook = useNotebook("exportMdContent");
    const context = {
        validators: {} as IKernelAPIValidators,
        document: "", // 测试用文档 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.document = await createDoc(notebook.id, "/exportMdContent", MARKDOWN);
    });

    it("main", async () => {
        const payload: exportMdContent.IPayload = { id: context.document };
        expectPayload(context.validators, payload);

        const response = await client.exportMdContent(payload);
        expectResponse(context.validators, response);

        /* 导出内容是否带有 YAML Front Matter 取决于工作空间的导出设置，因此只检查正文 */
        expect(response.data.hPath).toBe("/exportMdContent");
        expect(response.data.content).toContain(MARKDOWN);
    });
});
