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
import { newNodeID, preserveSnippets, uniqueName } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type getSnippet from "@/types/kernel/api/snippet/getSnippet";
import type setSnippet from "@/types/kernel/api/snippet/setSnippet";

const pathname = Client.api.snippet.getSnippet.pathname;

describe(pathname, () => {
    /* 设置代码片段会整体替换已有的代码片段，因此先保存，结束后恢复 */
    preserveSnippets();
    const context = {
        validators: {} as IKernelAPIValidators,
        snippets: [
            {
                id: newNodeID(),
                name: uniqueName("getSnippet-css"),
                type: "css",
                enabled: true,
                content: "/* getSnippet css */",
            },
            {
                id: "", // 由内核生成 ID
                name: uniqueName("getSnippet-js"),
                type: "js",
                enabled: false,
                content: "// getSnippet js",
            },
        ] as setSnippet.ISnippet[],
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        const { data } = await client.getSnippet({ type: "all", enabled: 2 });
        await client.setSnippet({ snippets: [...data.snippets, ...context.snippets] });
    });

    it.for<{ type: getSnippet.TSnippetType; enabled: number; expected: string[] }>([
        { type: "all", enabled: 2, expected: ["css", "js"] },
        { type: "css", enabled: 2, expected: ["css"] },
        { type: "js", enabled: 2, expected: ["js"] },
        { type: "all", enabled: 1, expected: ["css"] },
        { type: "all", enabled: 0, expected: ["js"] },
    ])("type: $type, enabled: $enabled", async ({ type, enabled, expected }) => {
        const payload: getSnippet.IPayload = { type, enabled };
        expectPayload(context.validators, payload);

        const response = await client.getSnippet(payload);
        expectResponse(context.validators, response);

        const names = context.snippets.map((snippet) => snippet.name);
        const snippets = response.data.snippets.filter((snippet) => names.includes(snippet.name));
        expect(snippets.map((snippet) => snippet.type).sort()).toEqual(expected);
        for (const snippet of snippets) {
            const expectedSnippet = context.snippets.find((s) => s.name === snippet.name)!;
            if (expectedSnippet.id !== "") {
                expect.soft(snippet.id, "snippet.id").toBe(expectedSnippet.id);
            }
            expect.soft(snippet.type, "snippet.type").toBe(expectedSnippet.type);
            expect.soft(snippet.enabled, "snippet.enabled").toBe(expectedSnippet.enabled);
            expect.soft(snippet.content, "snippet.content").toBe(expectedSnippet.content);
        }
    });
});
