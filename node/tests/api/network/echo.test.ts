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

import type { IKernelAPIValidators } from "~/tests/utils/schema";

const pathname = Client.api.network.echo.pathname;

/* 请求中携带的查询参数 */
const QUERY = { test1: "test-1", test2: "test-2" };

/* 请求体中携带的表单字段 */
const FORM = { test3: "test-3", test4: "test-4" };

describe(pathname, () => {
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
    });

    it("request with GET method", async () => {
        const response = await client.echo({
            method: "GET",
            query: new URLSearchParams(QUERY),
        });
        expectResponse(context.validators, response);
        expect.soft(response.data.Request.Method, "verify method").toBe("GET");
        for (const [key, value] of Object.entries(QUERY)) {
            expect(response.data.URL.Query[key], `verify query: ${key}`).toEqual([value]);
        }
    });

    it("request with POST method and URLSearchParams body (application/x-www-form-urlencoded)", async () => {
        const response = await client.echo({
            method: "POST",
            query: new URLSearchParams(QUERY),
            body: new URLSearchParams(FORM),
        });
        expectResponse(context.validators, response);
        expect.soft(response.data.Request.Method, "verify method").toBe("POST");
        for (const [key, value] of Object.entries(QUERY)) {
            expect(response.data.URL.Query[key], `verify query: ${key}`).toEqual([value]);
        }
        for (const [key, value] of Object.entries(FORM)) {
            expect(response.data.Request.Form[key], `verify body: ${key}`).toEqual([value]);
        }
    });

    it("request with POST method and FormData body (multipart/form-data)", async () => {
        const body = new FormData();
        for (const [key, value] of Object.entries(FORM)) {
            body.set(key, value);
        }
        const response = await client.echo({
            method: "POST",
            query: new URLSearchParams(QUERY),
            body,
        });
        expectResponse(context.validators, response);
        expect.soft(response.data.Request.Method, "verify method").toBe("POST");
        for (const [key, value] of Object.entries(QUERY)) {
            expect(response.data.URL.Query[key], `verify query: ${key}`).toEqual([value]);
        }
        for (const [key, value] of Object.entries(FORM)) {
            expect(response.data.Request.MultipartForm?.Value[key], `verify body: ${key}`).toEqual([value]);
        }
    });
});
