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

import { beforeAll, describe, expect, it, onTestFinished } from "vitest";

import CONSTANTS from "~/tests/constants";
import { expectPayload, expectResponse } from "~/tests/utils/assert";
import { removeFileIfExists } from "~/tests/utils/cleanup";
import { client } from "~/tests/utils/client";
import { useTempDir } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type exportResources from "@/types/kernel/api/export/exportResources";

const pathname = Client.api.export.exportResources.pathname;

/* ZIP 文件头 */
const ZIP_SIGNATURE = [0x50, 0x4B, 0x03, 0x04];

describe(pathname, () => {
    const dir = useTempDir("exportResources");
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        for (const name of [
            "file1.html",
            "file2.html",
            "folder1/file.html",
            "folder2/file.html",
        ]) {
            await client.putFile({ path: dir.resolve(name), file: CONSTANTS.TEST_FILE_CONTENT });
        }
    });

    it.for<{ name: string; paths: string[] }>([
        { name: "empty with name", paths: [] },
        { name: "files", paths: ["file1.html", "file2.html"] },
        { name: "folders", paths: ["folder1", "folder2"] },
        { name: "files + folders", paths: ["file1.html", "file2.html", "folder1", "folder2"] },
    ])("$name", async ({ name, paths }) => {
        const payload: exportResources.IPayload = {
            paths: paths.map((path) => dir.resolve(path)),
            name: `test-${name}`,
        };
        expectPayload(context.validators, payload);

        const response = await client.exportResources(payload);
        /* 压缩包生成在 temp/export 目录下，不在测试临时目录中，需要单独删除 */
        onTestFinished(async () => {
            await removeFileIfExists(response.data.path);
        });
        expectResponse(context.validators, response);

        const zip = await client.getFile({ path: response.data.path }, "arraybuffer");
        expect([...new Uint8Array(zip.slice(0, ZIP_SIGNATURE.length))]).toEqual(ZIP_SIGNATURE);
    });
});
