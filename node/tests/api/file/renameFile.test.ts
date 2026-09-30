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
import { useTempDir } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type renameFile from "@/types/kernel/api/file/renameFile";

const pathname = Client.api.file.renameFile.pathname;

describe(pathname, () => {
    const dir = useTempDir("renameFile");
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
    });

    /**
     * 重命名文件并校验
     * @param payload - 请求体
     */
    async function rename(payload: renameFile.IPayload): Promise<void> {
        expectPayload(context.validators, payload);

        const response = await client.renameFile(payload);
        expectResponse(context.validators, response);
    }

    it("rename file", async () => {
        const path = dir.resolve("rename-file/test.html");
        const newPath = dir.resolve("rename-file/test-new.html");
        await client.putFile({ path, file: CONSTANTS.TEST_FILE_CONTENT });

        await rename({ path, newPath });
        await expectKernelError(client.getFile({ path }, "json"), 404);
        await expect(client.getFile({ path: newPath }, "text"), `new path: ${newPath}`).resolves.toBe(CONSTANTS.TEST_FILE_CONTENT);
    });

    it("rename directory", async () => {
        const path = dir.resolve("rename-dir/");
        const newPath = dir.resolve("rename-dir-new/");
        await client.putFile({ path, isDir: true });

        await rename({ path, newPath });
        await expectKernelError(client.readDir({ path }), 404);
        await expect(client.readDir({ path: newPath }), `new path: ${newPath}`).resolves.toMatchObject({ code: 0 });
    });
});
