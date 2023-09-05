/**
 * Copyright (C) 2023 SiYuan Community
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {
    describe,
    test,
    expect,
} from "vitest";

import client from "~/tests/utils/client";
import { testKernelAPI, testResponse } from "~/tests/utils/test";
import { SchemaJSON } from "~/tests/utils/schema";

import forwardProxy from "@/types/kernel/api/network/forwardProxy";

const pathname = client.Client.api.network.forwardProxy.pathname;
const pathname_version = client.Client.api.system.version.pathname;

interface ICase {
    name: string,
    before?: () => void,
    payload: forwardProxy.IPayload,
    after?: (response: forwardProxy.IResponse, payload: forwardProxy.IPayload) => void,
    debug: boolean,
}

describe(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const schema_response_version = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname_version));
    await schema_response_version.loadSchemaFile();
    const validate_response_version = schema_response_version.constructValidateFuction();

    const cases: ICase[] = [
        /* GET 请求测试 */
        {
            name: "GET request",
            payload: {
                url: `${process.env.VITE_SIYUAN_SERVE}${pathname_version}`,
                method: "GET",
                headers: [{
                    Authorization: `Token ${process.env.VITE_SIYUAN_TOKEN}`
                }],
            },
            after: (response, payload) => {
                test("test response.data.body", async () => {
                    expect.soft(
                        response.data.bodyEncoding,
                        "verify bodyEncoding",
                    ).toEqual("text");
                });
            },
            debug: false,
        },
        {
            name: "GET request [text]",
            payload: {
                url: `${process.env.VITE_SIYUAN_SERVE}${pathname_version}`,
                method: "GET",
                headers: [{
                    Authorization: `Token ${process.env.VITE_SIYUAN_TOKEN}`
                }],
                responseEncoding: "text",
            },
            after: (response, payload) => {
                test("test response.data.body", async () => {
                    expect.soft(
                        response.data.bodyEncoding,
                        "verify bodyEncoding",
                    ).toEqual(payload.responseEncoding);

                    expect.soft(
                        validate_response_version(
                            JSON.parse(
                                response.data.body
                            )
                        ),
                        `verify response using JSON Schema`,
                    ).toBeTruthy(); // 校验响应体
                });
            },
            debug: false,
        },
        {
            name: "GET request [base64]",
            payload: {
                url: `${process.env.VITE_SIYUAN_SERVE}${pathname_version}`,
                method: "GET",
                headers: [{
                    Authorization: `Token ${process.env.VITE_SIYUAN_TOKEN}`
                }],
                responseEncoding: "base64",
            },
            after: (response, payload) => {
                console.log(response.data.body)
                test("test response.data.body", async () => {
                    expect.soft(
                        response.data.bodyEncoding,
                        "verify bodyEncoding",
                    ).toEqual(payload.responseEncoding);
                    expect.soft(
                        validate_response_version(
                            JSON.parse(
                                atob(
                                    response.data.body
                                )
                            )
                        ),
                        `verify response using JSON Schema`,
                    ).toBeTruthy(); // 校验响应体
                });
            },
            debug: false,
        },
        /* POST 请求测试 */
        {
            name: "POST request",
            payload: {
                url: `${process.env.VITE_SIYUAN_SERVE}${client.Client.api.system.version.pathname}`,
                method: "POST",
                headers: [{
                    Authorization: `Token ${process.env.VITE_SIYUAN_TOKEN}`
                }],
            },
            debug: false,
        },
    ];

    cases.forEach(item => {
        testKernelAPI<forwardProxy.IPayload, forwardProxy.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                validate: validate_payload,
                test: item.before,
            },
            request: (payload) => client.client.forwardProxy(payload!),
            response: {
                validate: validate_response,
                test: item.after,
            },
            debug: item.debug,
        });
    })
});
