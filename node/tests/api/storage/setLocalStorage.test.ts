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

import { expectPayload, expectResponse } from "~/tests/utils/assert";
import { FIXTURE_APP_ID } from "~/tests/utils/cleanup";
import { client } from "~/tests/utils/client";
import { preserveLocalStorage, uniqueName } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type setLocalStorage from "@/types/kernel/api/storage/setLocalStorage";

const pathname = Client.api.storage.setLocalStorage.pathname;

describe(pathname, () => {
    /* 设置本地存储会整体替换已有的内容，因此先保存，结束后恢复 */
    preserveLocalStorage();
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
    });

    it("main", async () => {
        const { data: storage } = await client.getLocalStorage();
        const payload: setLocalStorage.IPayload = {
            app: FIXTURE_APP_ID,
            val: {
                ...storage,
                [uniqueName("setLocalStorage")]: randomUUID(),
            },
        };
        expectPayload(context.validators, payload);

        const response = await client.setLocalStorage(payload);
        expectResponse(context.validators, response);

        const { data } = await client.getLocalStorage();
        expect(data).toEqual(payload.val);
    });
});
