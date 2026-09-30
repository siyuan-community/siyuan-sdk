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
import { createNestedBlocks, useNotebook } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { INestedBlocks } from "~/tests/utils/fixtures";
import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type getDoc from "@/types/kernel/api/filetree/getDoc";

const pathname = Client.api.filetree.getDoc.pathname;

describe(pathname, () => {
    const notebook = useNotebook("getDoc");
    const context = {
        validators: {} as IKernelAPIValidators,
        blocks: {} as INestedBlocks,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.blocks = await createNestedBlocks(notebook.id, "getDoc");
    });

    it.for<{ name: keyof INestedBlocks; parent: keyof INestedBlocks; parent2: keyof INestedBlocks }>([
        { name: "document", parent: "document", parent2: "document" },
        { name: "container", parent: "document", parent2: "document" },
        { name: "heading", parent: "container", parent2: "container" },
        { name: "block", parent: "container", parent2: "heading" }, // 标题块下方的块以标题块作为第二上级
    ])("$name", async ({ name, parent, parent2 }) => {
        const payload: getDoc.IPayload = { id: context.blocks[name] };
        expectPayload(context.validators, payload);

        const response = await client.getDoc(payload);
        expectResponse(context.validators, response);
        expect(response.data).toMatchObject({
            id: context.blocks[name],
            parentID: context.blocks[parent],
            parent2ID: context.blocks[parent2],
            rootID: context.blocks.document,
            path: `/${context.blocks.document}.sy`,
            box: notebook.id,
        });
    });
});
