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
import {
    appendMarkdown,
    createDoc,
    useNotebook,
    waitForIndexed,
} from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type sql from "@/types/kernel/api/query/sql";

const pathname = Client.api.query.sql.pathname;

/* SDK 描述的数据库表及其字段 */
const TABLES: Record<string, string[]> = {
    assets: ["id", "block_id", "root_id", "box", "docpath", "path", "name", "title", "hash"],
    attributes: ["id", "name", "value", "type", "block_id", "root_id", "box", "path"],
    blocks: [
        "id",
        "parent_id",
        "root_id",
        "hash",
        "box",
        "path",
        "hpath",
        "name",
        "alias",
        "memo",
        "tag",
        "content",
        "fcontent",
        "markdown",
        "length",
        "type",
        "subtype",
        "ial",
        "sort",
        "created",
        "updated",
    ],
    file_annotation_refs: ["id", "file_path", "annotation_id", "block_id", "root_id", "box", "path", "content", "type"],
    refs: [
        "id",
        "def_block_id",
        "def_block_parent_id",
        "def_block_root_id",
        "def_block_path",
        "block_id",
        "root_id",
        "box",
        "path",
        "content",
        "markdown",
        "type",
    ],
    spans: ["id", "block_id", "root_id", "box", "path", "content", "markdown", "type", "ial"],
};

describe(pathname, () => {
    const notebook = useNotebook("sql");
    const context = {
        validators: {} as IKernelAPIValidators,
        document: "", // 测试用文档 ID
        block: "", // 测试用段落块 ID
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.document = await createDoc(notebook.id, "/sql");
        context.block = await appendMarkdown(context.document, "sql paragraph");
        await waitForIndexed([context.document, context.block]);
    });

    /**
     * 执行 SQL 查询并校验
     * @param stmt - SQL 语句
     */
    async function query(stmt: string): Promise<sql.IResponse> {
        const payload: sql.IPayload = { stmt };
        expectPayload(context.validators, payload);

        const response = await client.sql(payload);
        expectResponse(context.validators, response);
        return response;
    }

    it("tables", async () => {
        const response = await query(`SELECT * FROM sqlite_master WHERE type = 'table' ORDER BY name;`);
        /* 全文检索虚拟表及其影子表、向量索引表等内部表随内核版本变化，因此只检查 SDK 描述的表 */
        expect(response.data.map((record) => record.name)).toEqual(expect.arrayContaining(Object.keys(TABLES)));
    });

    it.for(Object.entries(TABLES))("table %s", async ([table, fields]) => {
        const response = await query(`PRAGMA table_info('${table}');`);
        expect(response.data.map((record) => record.name).sort()).toEqual([...fields].sort());
    });

    it("records", async () => {
        const response = await query(`SELECT * FROM blocks WHERE root_id = '${context.document}' ORDER BY sort;`);
        expect(response.data).toEqual(expect.arrayContaining([
            expect.objectContaining({ id: context.document, type: "d", box: notebook.id }),
            expect.objectContaining({ id: context.block, type: "p", content: "sql paragraph" }),
        ]));
    });
});
