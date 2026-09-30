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

import { beforeAll, describe, it } from "vitest";

import { expectPayload, expectResponse } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import { createDoc, insertMarkdown, useNotebook } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type transferBlockRef from "@/types/kernel/api/block/transferBlockRef";

const pathname = Client.api.block.transferBlockRef.pathname;

/* 引用锚文本 */
const ANCHOR_TEXT = "Anchor text1";

interface IRefContext {
    notebook: string; // 测试用笔记本 ID
    document: string; // 测试用文档 ID
    container: string; // 被引用的容器块 ID
    ref: string; // 本用例新插入的引用块 ID
}

interface ICase {
    name: string;
    /* 构造待转移的引用 ID 列表 */
    refIDs?: (context: IRefContext) => transferBlockRef.IPayload["refIDs"];
    /* 为 true 时请求体中不包含 refIDs 字段 */
    omitRefIDs?: boolean;
}

describe(pathname, () => {
    const notebook = useNotebook("transferBlockRef");
    const context = {
        validators: {} as IKernelAPIValidators,
        document: "", // 测试用文档 ID
        container: "", // 被引用的容器块 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.document = await createDoc(notebook.id, "/transferBlockRef");
        context.container = await insertMarkdown({ parentID: context.document }, "{{{\ntransferBlockRef\n}}}");
    });

    it.for<ICase>([
        { name: "✖Transfer all block ref (refIDs: null)", refIDs: () => null },
        { name: "✖Transfer all block ref (refIDs omitted)", omitRefIDs: true },
        { name: "✖Transfer all block ref (refIDs: [])", refIDs: () => [] },
        { name: "✖Transfer notebook block ref", refIDs: ({ notebook }) => [notebook] },
        { name: "✔Transfer document block ref", refIDs: ({ document }) => [document] },
        { name: "✔Transfer parent block ref", refIDs: ({ container }) => [container] },
        { name: "✔Transfer current block ref", refIDs: ({ ref }) => [ref] },
    ])("$name", async (item) => {
        /* 插入一个引用了容器块的块 */
        const ref = await insertMarkdown(
            { previousID: context.container },
            `((${context.container} "${ANCHOR_TEXT}")) `.repeat(3),
        );

        const base = {
            fromID: context.container,
            toID: context.document,
        };
        const payload: transferBlockRef.IPayload = item.omitRefIDs
            ? base
            : { ...base, refIDs: item.refIDs!({ notebook: notebook.id, document: context.document, container: context.container, ref }) };
        expectPayload(context.validators, payload);

        const response = await client.transferBlockRef(payload);
        expectResponse(context.validators, response);
    });
});
