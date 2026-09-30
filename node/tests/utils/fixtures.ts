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

/**
 * 测试夹具
 * - 每个测试文件在 beforeAll 中创建自己需要的数据，在 afterAll 中删除，afterAll 在用例失败时同样会执行
 * - 夹具名称带有统一前缀，进程异常退出时遗留的数据由全局 setup/teardown 清理
 * - 会修改全局状态（本地存储、代码片段等）的测试需在开始前保存快照，结束后恢复
 */

import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, expect, vi } from "vitest";

import CONSTANTS from "~/tests/constants";

import {
    FIXTURE_APP_ID,
    FIXTURE_PREFIX,
    FIXTURE_TEMP_DIR,
    removeFileIfExists,
    removeLocalStorageVals,
} from "./cleanup";
import { client } from "./client";

import type insertBlock from "@/types/kernel/api/block/insertBlock";
import type getSnippet from "@/types/kernel/api/snippet/getSnippet";

/* 等待内核索引的默认超时时间 (单位: ms) */
export const INDEX_TIMEOUT = 30_000;

/**
 * 生成带有测试前缀的唯一名称
 * @param label - 名称标签，便于在工作空间中辨认
 */
export function uniqueName(label: string): string {
    return `${FIXTURE_PREFIX}-${label}-${randomUUID().slice(0, 8)}`;
}

/**
 * 生成思源格式的 ID，如 `20230725235727-lvt3puk`
 */
export function newNodeID(): string {
    const time = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
    const random = Array.from({ length: 7 }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("");
    return `${time}-${random}`;
}

export interface INotebookFixture {
    /* 笔记本 ID，beforeAll 执行完成后可用 */
    id: string;
    /* 笔记本名称 */
    readonly name: string;
}

/**
 * 在当前作用域注册一个临时笔记本：beforeAll 中创建，afterAll 中删除
 * @param label - 名称标签
 */
export function useNotebook(label: string): INotebookFixture {
    const fixture: INotebookFixture = {
        id: "",
        name: uniqueName(label),
    };
    beforeAll(async () => {
        const response = await client.createNotebook({ name: fixture.name });
        fixture.id = response.data.notebook.id;
    });
    afterAll(async () => {
        if (fixture.id) {
            await client.removeNotebook({ notebook: fixture.id });
        }
    });
    return fixture;
}

export interface ITempDirFixture {
    /* 临时目录路径（相对于工作空间目录） */
    readonly path: string;
    /**
     * 拼接临时目录下的路径
     * @param name - 相对于临时目录的路径
     */
    resolve: (name: string) => string;
}

/**
 * 在当前作用域注册一个临时目录：beforeAll 中创建，afterAll 中连同内容一起删除
 * @param label - 名称标签
 */
export function useTempDir(label: string): ITempDirFixture {
    const path = `${FIXTURE_TEMP_DIR}/${uniqueName(label)}`;
    beforeAll(async () => {
        await client.putFile({ path, isDir: true });
    });
    afterAll(async () => {
        await removeFileIfExists(path);
    });
    return {
        path,
        resolve: (name) => `${path}/${name.replace(/^\/+/, "")}`,
    };
}

/**
 * 在当前作用域开始前保存本地存储，结束后恢复：删除新增的键，并写回被修改或删除的键
 */
export function preserveLocalStorage(): void {
    let snapshot: Record<string, any> | undefined;
    beforeAll(async () => {
        snapshot = (await client.getLocalStorage()).data;
    });
    afterAll(async () => {
        if (!snapshot) {
            return;
        }
        const { data: current } = await client.getLocalStorage();
        await removeLocalStorageVals(Object.keys(current).filter((key) => !(key in snapshot!)));
        for (const [key, val] of Object.entries(snapshot)) {
            if (JSON.stringify(current[key]) !== JSON.stringify(val)) {
                await client.setLocalStorageVal({ app: FIXTURE_APP_ID, key, val });
            }
        }
    });
}

/**
 * 在当前作用域开始前保存全部代码片段，结束后原样写回
 */
export function preserveSnippets(): void {
    let snapshot: getSnippet.ISnippet[] | undefined;
    beforeAll(async () => {
        snapshot = (await client.getSnippet({ type: "all", enabled: 2 })).data.snippets;
    });
    afterAll(async () => {
        if (snapshot) {
            await client.setSnippet({ snippets: snapshot });
        }
    });
}

/**
 * 在笔记本中创建文档
 * @param notebook - 笔记本 ID
 * @param path - 文档的可读路径，如 `/foo/bar`
 * @param markdown - 文档内容
 * @returns 文档 ID
 */
export async function createDoc(notebook: string, path: string, markdown: string = ""): Promise<string> {
    const response = await client.createDocWithMd({ notebook, path, markdown });
    return response.data;
}

/**
 * 在指定块的下级块尾部插入 Markdown 内容
 * @param parentID - 父块 ID
 * @param markdown - Markdown 内容
 * @returns 新插入的块 ID
 */
export async function appendMarkdown(parentID: string, markdown: string): Promise<string> {
    const response = await client.appendBlock({ dataType: "markdown", data: markdown, parentID });
    return response.data[0].doOperations[0].id;
}

/**
 * 在指定块的下级块首部插入 Markdown 内容
 * @param parentID - 父块 ID
 * @param markdown - Markdown 内容
 * @returns 新插入的块 ID
 */
export async function prependMarkdown(parentID: string, markdown: string): Promise<string> {
    const response = await client.prependBlock({ dataType: "markdown", data: markdown, parentID });
    return response.data[0].doOperations[0].id;
}

/**
 * 在指定位置插入 Markdown 内容
 * @param position - 插入位置，`parentID`、`previousID`、`nextID` 三选一
 * @param markdown - Markdown 内容
 * @returns 新插入的块 ID
 */
export async function insertMarkdown(
    position: Pick<insertBlock.IPayload, "nextID" | "parentID" | "previousID">,
    markdown: string,
): Promise<string> {
    const response = await client.insertBlock({ dataType: "markdown", data: markdown, ...position });
    return response.data[0].doOperations[0].id;
}

export interface INestedBlocks {
    /* 文档块 ID */
    document: string;
    /* 超级块 ID */
    container: string;
    /* 超级块中的标题块 ID */
    heading: string;
    /* 超级块中的段落块 ID */
    block: string;
}

/**
 * 创建一个包含嵌套块的文档：文档中有一个超级块，超级块的第一个下级块是标题块，最后一个下级块是段落块
 * 文档路径为 `/${label}`，标题块与段落块的内容均为 label
 * @param notebook - 笔记本 ID
 * @param label - 文档标题与块内容
 */
export async function createNestedBlocks(notebook: string, label: string): Promise<INestedBlocks> {
    const document = await createDoc(notebook, `/${label}`);
    const container = await prependMarkdown(document, `{{{\n${label}\n}}}`);
    const heading = await prependMarkdown(container, `# ${label}`);
    const block = await appendMarkdown(container, label);
    return { document, container, heading, block };
}

export type TBlockSampleType = (typeof CONSTANTS.BLOCK_SAMPLES)[number]["type"];

/**
 * 创建包含 {@link CONSTANTS.BLOCK_SAMPLES} 中所有类型块的文档
 * @param notebook - 笔记本 ID
 * @returns 文档 ID 与各类型块的 ID
 */
export async function createBlockSamples(notebook: string): Promise<{
    document: string;
    blocks: Record<TBlockSampleType, string>;
}> {
    const markdown = CONSTANTS.BLOCK_SAMPLES.map((sample) => sample.markdown).join("\n\n");
    const document = await createDoc(notebook, "/blockSamples", markdown);
    const children = (await client.getChildBlocks({ id: document })).data;

    const blocks = {} as Record<TBlockSampleType, string>;
    for (const sample of CONSTANTS.BLOCK_SAMPLES) {
        const child = children.find((block) => block.type === sample.type);
        if (!child) {
            throw new Error(`The ${sample.label} sample was not parsed as a block of type "${sample.type}"`);
        }
        blocks[sample.type] = child.id;
    }
    return { document, blocks };
}

interface ISearchHistoryResponse {
    code: number;
    msg: string;
    data: {
        histories: string[];
    };
}

export interface IDocHistory {
    /* 已删除文档的 ID */
    id: string;
    /* 历史记录的创建时间（Unix 时间戳，单位: s） */
    created: string;
}

/**
 * 创建文档后将其删除，内核会为被删除的文档生成一条历史记录
 * 历史记录异步写入历史数据库，返回前会等待其可以被检索到
 * @param notebook - 笔记本 ID
 * @param path - 文档的可读路径
 * @param markdown - 文档内容
 */
export async function createDeletedDocHistory(notebook: string, path: string, markdown: string): Promise<IDocHistory> {
    const id = await createDoc(notebook, path, markdown);
    await client.removeDoc({ notebook, path: `/${id}.sy` });

    const created = await vi.waitFor(
        async () => {
            /* SDK 尚未封装该 API；type 3 表示按文档 ID 检索 */
            const response = await client._request<ISearchHistoryResponse, object>(
                "/api/history/searchHistory",
                "POST",
                { query: id, type: 3, op: "delete", page: 1 },
            );
            expect(response.data.histories, "histories of the removed document").not.toHaveLength(0);
            return response.data.histories[0]!;
        },
        { timeout: INDEX_TIMEOUT, interval: 200 },
    );
    return { id, created };
}

/**
 * 等待块被写入数据库索引
 * 内核异步地把块写入数据库，SQL 查询、全文搜索等 API 在索引完成前查不到新写入的块
 * @param ids - 块 ID 列表
 * @param timeout - 超时时间 (单位: ms)
 */
export async function waitForIndexed(ids: readonly string[], timeout: number = INDEX_TIMEOUT): Promise<void> {
    const list = ids.map((id) => `'${id}'`).join(", ");
    await vi.waitFor(
        async () => {
            await client.flushTransaction();
            const response = await client.sql({ stmt: `SELECT id FROM blocks WHERE id IN (${list})` });
            expect(response.data, "indexed blocks").toHaveLength(ids.length);
        },
        { timeout, interval: 200 },
    );
}
