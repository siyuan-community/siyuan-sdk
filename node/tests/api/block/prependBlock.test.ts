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
import { createDoc, prependMarkdown, useNotebook } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type prependBlock from "@/types/kernel/api/block/prependBlock";

const pathname = Client.api.block.prependBlock.pathname;

describe(pathname, () => {
    const notebook = useNotebook("prependBlock");
    const context = {
        validators: {} as IKernelAPIValidators,
        container: "", // 测试用容器块 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        const document = await createDoc(notebook.id, "/prependBlock");
        context.container = await prependMarkdown(document, "{{{\nprependBlock\n}}}");
    });

    it.for([
        "Paragraph block", // 段落块
    ])("prepend: %s", async (markdown) => {
        const payload: prependBlock.IPayload = {
            dataType: "markdown",
            data: markdown,
            parentID: context.container,
        };
        expectPayload(context.validators, payload);

        const response = await client.prependBlock(payload);
        expectResponse(context.validators, response);

        /* 新块位于容器块的开头 */
        const children = await client.getChildBlocks({ id: context.container });
        expect(children.data.at(0)?.id).toBe(response.data[0].doOperations[0].id);
    });
});
