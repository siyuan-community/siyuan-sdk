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

import { describe, expect, it } from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import type echo from "@/types/kernel/api/network/echo";

const pathname = client.Client.api.network.echo.pathname;

interface ICase<P extends echo.IPayload = echo.IPayload, R extends echo.IResponse = echo.IResponse> {
    name: string;
    before?: (payload: P) => void;
    payload: P;
    after?: (response: R, payload: P) => void;
    debug: boolean;
}

describe(pathname, async () => {
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_response.loadSchemaFile();
    const validate_response = schema_response.constructValidateFuction();

    const cases: ICase[] = [
        /* GET 请求测试 */
        {
            name: "GET request",
            payload: {
                method: "GET",
                query: new URLSearchParams({
                    test1: "test-1",
                    test2: "test-2",
                }),
            },
            after: (response, payload) => {
                it("test GET response", async () => {
                    expect.soft(response.data.Request.Method, "verify method").toEqual(payload.method);
                    payload.query!.forEach((value, key) => {
                        expect(response.data.URL.Query[key].includes(value), `verify query: ${key}`).toBeTruthy();
                    });
                });
            },
            debug: false,
        },
        /* POST 请求测试 */
        {
            name: "POST request URLSearchParams body (application/x-www-form-urlencoded)",
            payload: {
                method: "POST",
                query: new URLSearchParams({
                    test1: "test-1",
                    test2: "test-2",
                }),
                body: new URLSearchParams({
                    test3: "test-3",
                    test4: "test-4",
                }),
            },
            after: (response, payload) => {
                it("test POST response", async () => {
                    expect.soft(response.data.Request.Method, "verify method").toEqual(payload.method);
                    payload.query!.forEach((value, key) => {
                        expect(response.data.URL.Query[key], `verify query: ${key}`).toEqual(payload.query!.getAll(key));
                    });
                    (payload.body as URLSearchParams).forEach((value, key) => {
                        expect(response.data.Request.Form[key], `verify body: ${key}`).toEqual((payload.body as URLSearchParams).getAll(key));
                    });
                });
            },
            debug: false,
        },
        {
            name: "POST request FormData body (multipart/form-data)",
            payload: {
                method: "POST",
                query: new URLSearchParams({
                    test1: "test-1",
                    test2: "test-2",
                }),
                body: new FormData(),
            },
            before: (payload) => {
                (payload.body as FormData).set("test3", "test-3");
                (payload.body as FormData).set("test4", "test-4");
            },
            after: (response, payload) => {
                it("test POST", async () => {
                    expect.soft(response.data.Request.Method, "verify method").toEqual(payload.method);
                    payload.query!.forEach((value, key) => {
                        expect(response.data.URL.Query[key], `verify query: ${key}`).toEqual(payload.query!.getAll(key));
                    });
                    (payload.body as FormData).forEach((value, key) => {
                        expect(response.data.Request.MultipartForm?.Value[key], `verify body: ${key}`).toEqual((payload.body as FormData).getAll(key));
                    });
                });
            },
            debug: false,
        },
    ];

    cases.forEach((item) => {
        testKernelAPI<echo.IPayload, echo.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                test: item.before,
            },
            request: (payload) => client.client.echo(payload!),
            response: {
                validate: validate_response,
                test: item.after,
            },
            debug: item.debug,
        });
    });
});
