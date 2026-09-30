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

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import CONSTANTS from "~/tests/constants";
import { expectPayload, expectResponse } from "~/tests/utils/assert";
import { PANDOC_DIR, removeFileIfExists } from "~/tests/utils/cleanup";
import { client } from "~/tests/utils/client";
import { uniqueName } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type pandoc from "@/types/kernel/api/convert/pandoc";

const pathname = Client.api.convert.pandoc.pathname;

describe(pathname, () => {
    /* pandoc 在工作空间的 temp/convert/pandoc/<dir> 目录中执行 */
    const dir = uniqueName("pandoc");
    const dirPath = `${PANDOC_DIR}/${dir}`;
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        await client.putFile({
            path: `${dirPath}/test.html`,
            file: CONSTANTS.TEST_FILE_CONTENT,
        });
    });

    afterAll(async () => {
        await removeFileIfExists(dirPath);
    });

    /**
     * 调用 pandoc 并校验
     * @param payload - 请求体
     */
    async function run(payload: pandoc.IPayload): Promise<pandoc.IResponse> {
        expectPayload(context.validators, payload);
        const response = await client.pandoc(payload);
        expectResponse(context.validators, response);
        return response;
    }

    it("pandoc help", async () => {
        /* 未指定 dir 时内核会在转换目录中新建一个随机目录，因此同样使用测试目录 */
        await run({ dir, args: ["-h"] });
    });

    it("convert html to markdown", async () => {
        await run({
            dir,
            args: [
                "--to",
                "gfm-raw_html+tex_math_dollars+pipe_tables",
                "test.html",
                "-o",
                "test.md",
            ],
        });

        const markdown = await client.getFile({ path: `${dirPath}/test.md` }, "text");
        expect(markdown).toContain("一级标题");
    });
});
