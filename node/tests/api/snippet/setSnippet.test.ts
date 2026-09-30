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
import { env } from "~/tests/utils/env";
import { newNodeID, preserveSnippets, uniqueName } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type setSnippet from "@/types/kernel/api/snippet/setSnippet";

const pathname = Client.api.snippet.setSnippet.pathname;

describe(pathname, () => {
    /* 设置代码片段会整体替换已有的代码片段，因此先保存，结束后恢复 */
    preserveSnippets();
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
    });

    it("main", async () => {
        const snippets: setSnippet.ISnippet[] = [
            {
                id: newNodeID(),
                name: uniqueName("setSnippet-css"),
                type: "css",
                enabled: true,
                content: "/* setSnippet css */",
            },
            {
                id: "", // 由内核生成 ID
                name: uniqueName("setSnippet-js"),
                type: "js",
                enabled: false,
                content: "// setSnippet js",
            },
        ];
        const payload: setSnippet.IPayload = { snippets };
        expectPayload(context.validators, payload);

        const response = await client.setSnippet(payload);
        expectResponse(context.validators, response);

        /* 内核通过 /snippets/<name>.<type> 提供代码片段的内容 */
        for (const snippet of snippets) {
            const content = await (await fetch(`${env.serve}/snippets/${snippet.name}.${snippet.type}`)).text();
            expect(content, `${snippet.name}.${snippet.type}`).toBe(snippet.content);
        }
    });
});
