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

import { expectResponse } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";
import { KernelError } from "@/errors/kernel";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

const pathname = Client.api.system.logoutAuth.pathname;

/* 测试请求使用 API token 鉴权，注销会话不影响后续请求 */
describe(pathname, () => {
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
    });

    it("main", async () => {
        try {
            const response = await client.logoutAuth();
            expectResponse(context.validators, response);
        }
        catch (error) {
            /* 工作空间未设置访问授权码时，内核返回错误并在 closeTimeout 后关闭提示 */
            expect(error, "error instance of KernelError").toBeInstanceOf(KernelError);
            expect((error as KernelError).data, "response data include closeTimeout property").toHaveProperty("closeTimeout", 5000);
        }
    });
});
