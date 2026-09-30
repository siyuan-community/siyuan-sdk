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
import { BlockSubType, NodeType } from "@/utils/siyuan";

import type { INestedBlocks } from "~/tests/utils/fixtures";
import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type getBlockBreadcrumb from "@/types/kernel/api/block/getBlockBreadcrumb";

const pathname = Client.api.block.getBlockBreadcrumb.pathname;

type TBreadcrumbItem = [keyof INestedBlocks, NodeType, BlockSubType];

describe(pathname, () => {
    const notebook = useNotebook("getBlockBreadcrumb");
    const context = {
        validators: {} as IKernelAPIValidators,
        blocks: {} as INestedBlocks,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.blocks = await createNestedBlocks(notebook.id, "getBlockBreadcrumb");
    });

    const document: TBreadcrumbItem = ["document", NodeType.NodeDocument, BlockSubType.none];
    const container: TBreadcrumbItem = ["container", NodeType.NodeSuperBlock, BlockSubType.none];
    const heading: TBreadcrumbItem = ["heading", NodeType.NodeHeading, BlockSubType.h1];
    const block: TBreadcrumbItem = ["block", NodeType.NodeParagraph, BlockSubType.none];

    it.for<{ name: keyof INestedBlocks; path: TBreadcrumbItem[] }>([
        { name: "document", path: [document] },
        { name: "container", path: [document, container] },
        { name: "heading", path: [document, heading] }, // 面包屑中不包含超级块
        { name: "block", path: [document, heading, block] }, // 标题块下方的块以标题块作为上级
    ])("$name", async ({ name, path }) => {
        const payload: getBlockBreadcrumb.IPayload = { id: context.blocks[name] };
        expectPayload(context.validators, payload);

        const response = await client.getBlockBreadcrumb(payload);
        expectResponse(context.validators, response);

        expect(response.data.map((item) => [item.id, item.type, item.subType])).toEqual(
            path.map(([key, type, subType]) => [context.blocks[key], type, subType]),
        );
    });
});
