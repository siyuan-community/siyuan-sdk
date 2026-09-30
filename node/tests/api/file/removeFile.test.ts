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

import CONSTANTS from "~/tests/constants";
import { expectKernelError, expectPayload, expectResponse } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import { useTempDir } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type removeFile from "@/types/kernel/api/file/removeFile";

const pathname = Client.api.file.removeFile.pathname;

describe(pathname, () => {
    const dir = useTempDir("removeFile");
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
    });

    /**
     * 删除文件并校验
     * @param path - 文件或目录路径
     */
    async function remove(path: string): Promise<void> {
        const payload: removeFile.IPayload = { path };
        expectPayload(context.validators, payload);

        const response = await client.removeFile(payload);
        expectResponse(context.validators, response);
    }

    it("remove file", async () => {
        const path = dir.resolve("remove-file/test.html");
        await client.putFile({ path, file: CONSTANTS.TEST_FILE_CONTENT });

        await remove(path);
        await expectKernelError(client.getFile({ path }, "json"), 404);
    });

    it("remove dir", async () => {
        const path = dir.resolve("remove-dir/");
        await client.putFile({ path, isDir: true });

        await remove(path);
        await expectKernelError(client.readDir({ path }), 404);
    });

    it("non-existent path", async () => {
        await expectKernelError(client.removeFile({ path: dir.resolve("none-existent") }), 404);
    });
});
