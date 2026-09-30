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
import { appendMarkdown, createDoc, useNotebook } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type getDocInfo from "@/types/kernel/api/block/getDocInfo";

const pathname = Client.api.block.getDocInfo.pathname;

describe(pathname, () => {
    const notebook = useNotebook("getDocInfo");
    const context = {
        validators: {} as IKernelAPIValidators,
        document: "", // 测试用文档 ID
        block: "", // 测试用段落块 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.document = await createDoc(notebook.id, "/getDocInfo");
        context.block = await appendMarkdown(context.document, "getDocInfo");
    });

    it.for<"block" | "document">([
        "document",
        "block",
    ])("id: %s", async (name) => {
        const payload: getDocInfo.IPayload = { id: context[name] };
        expectPayload(context.validators, payload);

        const response = await client.getDocInfo(payload);
        expectResponse(context.validators, response);

        expect.soft(response.data.id, "data.id").toBe(payload.id);
        expect.soft(response.data.rootID, "data.rootID").toBe(context.document);
        expect.soft(response.data.name, "data.name").toBe("getDocInfo");
        expect.soft(response.data.refCount, "data.refCount").toBe(0);
        expect.soft(response.data.subFileCount, "data.subFileCount").toBe(0);
        expect.soft(response.data.refIDs, "data.refIDs").toHaveLength(0);
        expect.soft(response.data.icon, "data.icon").toBe("");
        expect.soft(response.data.ial, "data.ial").toMatchObject({
            id: context.document,
            title: "getDocInfo",
        });
    });
});
