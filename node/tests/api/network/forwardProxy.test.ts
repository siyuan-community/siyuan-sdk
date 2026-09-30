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

import { expectPayload, expectResponse, expectSchema } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import { env } from "~/tests/utils/env";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type forwardProxy from "@/types/kernel/api/network/forwardProxy";

const pathname = Client.api.network.forwardProxy.pathname;
const pathname_version = Client.api.system.version.pathname;

/* 通过内核代理请求内核自身的 API，不依赖外部网络 */
describe(pathname, () => {
    const context = {
        validators: {} as IKernelAPIValidators,
        validators_version: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.validators_version = await loadKernelAPISchemas(pathname_version);
    });

    /**
     * 通过代理请求 `/api/system/version` 并校验
     * @param options - 请求体中除 url 与鉴权请求头之外的字段
     */
    async function proxy(options: Omit<forwardProxy.IPayload, "headers" | "url">): Promise<forwardProxy.IResponse> {
        const payload: forwardProxy.IPayload = {
            url: `${env.serve}${pathname_version}`,
            headers: [
                { Authorization: `Token ${env.token}` },
            ],
            ...options,
        };
        expectPayload(context.validators, payload);

        const response = await client.forwardProxy(payload);
        expectResponse(context.validators, response);
        expect(response.data.status, "proxied response status").toBe(200);
        return response;
    }

    it("request with GET method", async () => {
        const response = await proxy({ method: "GET" });
        expect.soft(response.data.bodyEncoding, "verify bodyEncoding").toBe("text");
    });

    it("request with GET method [text]", async () => {
        const response = await proxy({ method: "GET", responseEncoding: "text" });
        expect.soft(response.data.bodyEncoding, "verify bodyEncoding").toBe("text");
        expectSchema(context.validators_version.response!, JSON.parse(response.data.body), "proxied response");
    });

    it("request with GET method [base64]", async () => {
        const response = await proxy({ method: "GET", responseEncoding: "base64" });
        expect.soft(response.data.bodyEncoding, "verify bodyEncoding").toBe("base64");
        expectSchema(context.validators_version.response!, JSON.parse(atob(response.data.body)), "proxied response");
    });

    it("request with POST method", async () => {
        const response = await proxy({ method: "POST" });
        expectSchema(context.validators_version.response!, JSON.parse(response.data.body), "proxied response");
    });
});
