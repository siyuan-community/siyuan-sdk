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
} from "vitest";

import client from "~/tests/utils/client";
import { testKernelAPI } from "~/tests/utils/test";
import { SchemaJSON } from "~/tests/utils/schema";

import forwardProxy from "@/types/kernel/api/network/forwardProxy";

const pathname = client.Client.api.network.forwardProxy.pathname;

interface ICase {
    name: string,
    before?: () => void,
    payload: forwardProxy.IPayload,
    after?: () => void,
    debug: boolean,
}

describe(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const cases: ICase[] = [
        /* GET 请求测试 */
        {
            name: "GET request",
            payload: {
                url: `${process.env.VITE_SIYUAN_SERVE}${client.Client.api.system.version.pathname}`,
                method: "GET",
                headers: [{
                    Authorization: `Token ${process.env.VITE_SIYUAN_TOKEN}`
                }],
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
