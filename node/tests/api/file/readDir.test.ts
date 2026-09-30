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

import CONSTANTS from "~/tests/constants";
import { expectKernelError, expectPayload, expectResponse } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import { uniqueName, useTempDir } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type readDir from "@/types/kernel/api/file/readDir";

const pathname = Client.api.file.readDir.pathname;

describe(pathname, () => {
    const dir = useTempDir("readDir");
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        await client.putFile({ path: dir.resolve("file.html"), file: CONSTANTS.TEST_FILE_CONTENT });
        await client.putFile({ path: dir.resolve("folder"), isDir: true });
    });

    /**
     * 读取目录，校验请求体
     * @param path - 目录路径
     */
    function read(path: string): Promise<readDir.IResponse> {
        const payload: readDir.IPayload = { path };
        expectPayload(context.validators, payload);
        return client.readDir(payload);
    }

    /* 工作空间目录 */
    it.for(["", "/", ".", "./", "./.", "././"])("workspace: %s", async (path) => {
        const response = await read(path);
        expectResponse(context.validators, response);
        expect(response.data.map((entry) => entry.name)).toEqual(expect.arrayContaining(["conf", "data"]));
    });

    /* 工作空间/data 目录，其中的 assets 与 templates 目录由内核在启动时创建 */
    it.for(["data", "data/", "/data", "/data/", "./data", "./data/", "./data/.", "./data/./"])("data: %s", async (path) => {
        const response = await read(path);
        expectResponse(context.validators, response);
        expect(response.data.map((entry) => entry.name)).toEqual(expect.arrayContaining(["assets", "templates"]));
    });

    it("test temporary directory", async () => {
        const response = await read(dir.path);
        expectResponse(context.validators, response);
        expect(response.data).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: "file.html", isDir: false }),
            expect.objectContaining({ name: "folder", isDir: true }),
        ]));
    });

    /* 工作空间外目录 */
    it.for(["..", "../", "/..", "/../", "./..", "./../", "./../.", "./.././"])("outside workspace: %s", async (path) => {
        await expectKernelError(read(path), 403);
    });

    it("non-existent directory", async () => {
        await expectKernelError(read(dir.resolve(uniqueName("none-existent"))), 404);
    });

    it("file", async () => {
        await expectKernelError(read(dir.resolve("file.html")), 409);
    });
});
