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
 * 收集箱中的速记来自云端账号，测试无法在工作空间中自行创建，
 * 因此这里只测试获取速记失败时内核返回的错误码；测试工作空间未登录云端账号，内核不访问网络即返回鉴权失败
 */

import { beforeAll, describe, it } from "vitest";

import { expectKernelError, expectPayload } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type getShorthand from "@/types/kernel/api/inbox/getShorthand";

const pathname = Client.api.inbox.getShorthand.pathname;

describe(pathname, () => {
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
    });

    it("non-existent shorthand", async () => {
        /* 速记 ID 为 13 位毫秒时间戳 */
        const payload: getShorthand.IPayload = { id: "0000000000000" };
        expectPayload(context.validators, payload);

        await expectKernelError(client.getShorthand(payload), 1);
    });
});
