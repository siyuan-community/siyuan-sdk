// Copyright (C) 2024 SiYuan Community
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

import { expectSchema } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import { env } from "~/tests/utils/env";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

const pathname_version = Client.api.system.version.pathname;

/* $fetch 通过内核代理发送请求，这里请求内核自身的 API，不依赖外部网络 */
describe("$fetch", () => {
    const context = {
        validators: {} as IKernelAPIValidators,
    };
    const url = `${env.serve}${pathname_version}`;
    const init: RequestInit = {
        headers: {
            Authorization: `Token ${env.token}`,
        },
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname_version);
    });

    it.for(["GET", "POST"])(`test %s ${pathname_version}`, async (method) => {
        const response = await client.$fetch(url, {
            ...init,
            method,
            body: method === "POST" ? "{}" : undefined,
        });
        expect(response.status).toBe(200);
        expectSchema(context.validators.response!, await response.json(), "response");
    });
});
