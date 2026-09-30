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

import { afterAll, beforeAll, describe, expect, it, onTestFinished } from "vitest";

import { expectResponse } from "~/tests/utils/assert";
import { FIXTURE_ASSETS_DIR, removeFileIfExists } from "~/tests/utils/cleanup";
import { client } from "~/tests/utils/client";
import { uniqueName } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type upload from "@/types/kernel/api/asset/upload";

const pathname = Client.api.asset.upload.pathname;

/**
 * 构造测试用的文本文件，文件内容与文件名相同
 * @param count - 文件数量
 */
function createFiles(count: number): File[] {
    return Array.from({ length: count }, () => {
        const name = `${uniqueName("upload")}.txt`;
        return new File([name], name, { type: "text/plain" });
    });
}

describe(pathname, () => {
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
    });

    afterAll(async () => {
        /* 删除上传时创建的测试资源目录 */
        await removeFileIfExists(`/data${FIXTURE_ASSETS_DIR}`);
    });

    it.for<{ name: string; assetsDirPath?: string; count: number }>([
        { name: "upload file to the default assets directory", count: 1 },
        { name: "upload files", assetsDirPath: FIXTURE_ASSETS_DIR, count: 2 },
        { name: "upload files to sub dir", assetsDirPath: `${FIXTURE_ASSETS_DIR}dir1/dir2/`, count: 2 },
    ])("$name", async ({ assetsDirPath, count }) => {
        const payload: upload.IPayload = {
            assetsDirPath,
            files: createFiles(count),
        };

        const response = await client.upload(payload);
        /* 上传的文件在用例结束后删除 */
        onTestFinished(async () => {
            for (const path of Object.values(response.data.succMap)) {
                await removeFileIfExists(`/data/${path}`);
            }
        });
        expectResponse(context.validators, response);

        for (const file of payload.files) {
            const path = response.data.succMap[file.name];
            expect(path, `uploaded file "${file.name}"`).toBeDefined();
            if (assetsDirPath) {
                expect(`/${path}`, "assets directory").toContain(assetsDirPath);
            }
            await expect(client.getFile({ path: `/data/${path}` }, "text"), "uploaded content").resolves.toBe(file.name);
        }
    });
});
