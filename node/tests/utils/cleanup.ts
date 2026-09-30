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

/* 测试夹具的命名约定与清理逻辑，不依赖 vitest 运行时，可在全局 setup 中使用 */

import { KernelError } from "@/errors/kernel";

import { client } from "./client";

/* 测试夹具名称前缀，带有该前缀的笔记本、文件、代码片段与本地存储项都视为测试数据 */
export const FIXTURE_PREFIX = "siyuan-sdk-test";

/* 测试用临时文件的根目录（相对于工作空间目录） */
export const FIXTURE_TEMP_DIR = `/temp/${FIXTURE_PREFIX}`;

/* 测试上传资源文件的目录（相对于 data 目录） */
export const FIXTURE_ASSETS_DIR = `/assets/${FIXTURE_PREFIX}/`;

/* 默认资源目录（相对于工作空间目录），上传时未指定目录的资源文件保存在该目录中 */
export const ASSETS_DIR = "/data/assets";

/* 模板目录（相对于工作空间目录），内核只渲染该目录中的模板文件 */
export const TEMPLATES_DIR = "/data/templates";

/* pandoc 工作目录（相对于工作空间目录），每次转换在其中的一个子目录中执行 */
export const PANDOC_DIR = "/temp/convert/pandoc";

/* 调用会修改全局状态的 API 时使用的 app 标识，格式与前端窗口的 app ID 相同（5 位小写字母或数字） */
export const FIXTURE_APP_ID = "tests";

/**
 * 判断名称是否属于测试夹具
 * @param name - 笔记本名、代码片段名或本地存储键名
 */
export function isFixtureName(name: string): boolean {
    return name.startsWith(FIXTURE_PREFIX);
}

/**
 * 删除工作空间中的文件或目录，路径不存在时忽略
 * @param path - 相对于工作空间目录的路径
 * @returns 是否删除了文件或目录
 */
export async function removeFileIfExists(path: string): Promise<boolean> {
    try {
        await client.removeFile({ path });
        return true;
    }
    catch (error) {
        if (error instanceof KernelError && error.code === 404) {
            return false;
        }
        throw error;
    }
}

/**
 * 删除本地存储中的指定键
 * `/api/storage/setLocalStorage` 已被内核弃用，因此逐项删除而不是整体写回
 * @param keys - 键名列表
 */
export async function removeLocalStorageVals(keys: string[]): Promise<void> {
    if (keys.length > 0) {
        /* SDK 尚未封装该 API */
        await client._request("/api/storage/removeLocalStorageVals", "POST", { app: FIXTURE_APP_ID, keys });
    }
}

/**
 * 列出目录中的条目名，目录不存在时返回空列表
 * @param path - 相对于工作空间目录的路径
 */
async function listDir(path: string): Promise<string[]> {
    try {
        const response = await client.readDir({ path });
        return response.data.map((entry) => entry.name);
    }
    catch (error) {
        if (error instanceof KernelError && error.code === 404) {
            return [];
        }
        throw error;
    }
}

/**
 * 清理工作空间中遗留的测试夹具
 * @returns 被清理的夹具描述列表
 */
export async function sweepFixtures(): Promise<string[]> {
    const removed: string[] = [];

    /* 笔记本（其中的文档、每日笔记、书签等随之删除） */
    const { data: { notebooks } } = await client.lsNotebooks();
    for (const notebook of notebooks) {
        if (isFixtureName(notebook.name)) {
            await client.removeNotebook({ notebook: notebook.id });
            removed.push(`notebook ${notebook.name}`);
        }
    }

    /* 临时文件与资源文件的根目录由测试自动创建，只有其中遗留的条目才算作未清理的夹具 */
    for (const dir of [
        FIXTURE_TEMP_DIR,
        `/data${FIXTURE_ASSETS_DIR}`.replace(/\/$/, ""),
    ]) {
        for (const name of await listDir(dir)) {
            removed.push(`path ${dir}/${name}`);
        }
        await removeFileIfExists(dir);
    }

    /* 模板目录、pandoc 工作目录与默认资源目录中带有测试前缀的条目 */
    for (const dir of [
        TEMPLATES_DIR,
        PANDOC_DIR,
        ASSETS_DIR,
    ]) {
        for (const name of (await listDir(dir)).filter(isFixtureName)) {
            await removeFileIfExists(`${dir}/${name}`);
            removed.push(`path ${dir}/${name}`);
        }
    }

    /* 代码片段 */
    const { data: { snippets } } = await client.getSnippet({ type: "all", enabled: 2 });
    const kept = snippets.filter((snippet) => !isFixtureName(snippet.name));
    if (kept.length !== snippets.length) {
        await client.setSnippet({ snippets: kept });
        removed.push(`${snippets.length - kept.length} snippet(s)`);
    }

    /* 本地存储项 */
    const { data: storage } = await client.getLocalStorage();
    const keys = Object.keys(storage).filter(isFixtureName);
    if (keys.length > 0) {
        await removeLocalStorageVals(keys);
        removed.push(`local storage ${keys.join(", ")}`);
    }

    return removed;
}
