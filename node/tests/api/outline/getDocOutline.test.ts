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

import { beforeAll, describe, expect, it } from "vitest";

import { expectPayload, expectResponse } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import { createDoc, useNotebook } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type getDocOutline from "@/types/kernel/api/outline/getDocOutline";

const pathname = Client.api.outline.getDocOutline.pathname;

describe(pathname, () => {
    const notebook = useNotebook("getDocOutline");
    const context = {
        validators: {} as IKernelAPIValidators,
        document: "", // 测试用文档 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.document = await createDoc(
            notebook.id,
            "/getDocOutline",
            "# Heading1\n\nParagraph\n\n## Heading1.1\n\nParagraph\n\n# Heading2\n",
        );
    });

    it("main", async () => {
        const payload: getDocOutline.IPayload = { id: context.document };
        expectPayload(context.validators, payload);

        const response = await client.getDocOutline(payload);
        expectResponse(context.validators, response);

        /* 标题文本以 HTML 形式返回，测试数据不含空格等会被转义的字符 */
        expect(response.data.map((node) => [node.name, node.subType])).toEqual([
            ["Heading1", "h1"],
            ["Heading2", "h1"],
        ]);
        expect(response.data[0]!.blocks?.map((node) => [node.content, node.subType])).toEqual([
            ["Heading1.1", "h2"],
        ]);
    });
});
