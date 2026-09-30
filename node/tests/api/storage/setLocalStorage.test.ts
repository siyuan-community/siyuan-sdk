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

import { randomUUID } from "node:crypto";

import { beforeAll, describe, expect, it } from "vitest";

import { expectKernelError, expectPayload } from "~/tests/utils/assert";
import { FIXTURE_APP_ID } from "~/tests/utils/cleanup";
import { client } from "~/tests/utils/client";
import { uniqueName } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type setLocalStorage from "@/types/kernel/api/storage/setLocalStorage";

const pathname = Client.api.storage.setLocalStorage.pathname;

/* 内核 v3.7.0 起该 API 已停用，调用时始终返回错误且不修改本地存储 */
describe(pathname, () => {
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
    });

    it("deprecated", async () => {
        const { data: before } = await client.getLocalStorage();
        const payload: setLocalStorage.IPayload = {
            app: FIXTURE_APP_ID,
            val: {
                ...before,
                [uniqueName("setLocalStorage")]: randomUUID(),
            },
        };
        expectPayload(context.validators, payload);

        const error = await expectKernelError(client.setLocalStorage(payload), -1);
        expect(error.msg).toContain("is deprecated");

        const { data: after } = await client.getLocalStorage();
        expect(after).toEqual(before);
    });
});
