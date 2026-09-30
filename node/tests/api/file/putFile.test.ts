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
import { expectResponse } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import { useTempDir } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type putFile from "@/types/kernel/api/file/putFile";

const pathname = Client.api.file.putFile.pathname;

describe(pathname, () => {
    const dir = useTempDir("putFile");
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
    });

    /**
     * 写入文件并校验
     * @param payload - 请求体
     */
    async function put(payload: putFile.IPayload): Promise<void> {
        const response = await client.putFile(payload);
        expectResponse(context.validators, response);
    }

    it("create dir", async () => {
        const path = dir.resolve("dir");
        await put({ path, isDir: true });
        await expect(client.readDir({ path }), `dir path: ${path}`).resolves.toMatchObject({ code: 0 });
    });

    it.for<{ name: string; file: () => Blob | string }>([
        { name: "string", file: () => CONSTANTS.TEST_FILE_CONTENT },
        { name: "Blob", file: () => new Blob([CONSTANTS.TEST_FILE_CONTENT]) },
        { name: "File", file: () => new File([CONSTANTS.TEST_FILE_CONTENT], "test.html") },
    ])("create file with $name", async ({ name, file }) => {
        const path = dir.resolve(`file-${name}.html`);
        await put({ path, file: file() });
        await expect(client.getFile({ path }, "text"), `file path: ${path}`).resolves.toBe(CONSTANTS.TEST_FILE_CONTENT);
    });

    it("create file with custom modified time", async () => {
        const modTime = new Date("2001-02-03T04:05:06.007Z").getTime();
        await put({ path: dir.resolve("modTime.html"), file: CONSTANTS.TEST_FILE_CONTENT, modTime });

        /* readDir 返回的修改时间精确到秒 */
        const entries = await client.readDir({ path: dir.path });
        expect(entries.data.find((entry) => entry.name === "modTime.html")?.updated).toBe(Math.floor(modTime / 1000));
    });
});
