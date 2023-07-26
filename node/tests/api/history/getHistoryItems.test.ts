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

import getHistoryItems from "@/types/kernel/api/history/getHistoryItems";

const pathname = client.Client.api.history.getHistoryItems.pathname;

interface ICase {
    name: string,
    before?: () => void,
    payload: getHistoryItems.IPayload,
    after?: (response: getHistoryItems.IResponse, payload: getHistoryItems.IPayload) => void,
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
        {
            name: "operate default",
            payload: {
                created: "1690304916",
                query: "20200812220555-lj3enxa",
                type: 3,
            },
            debug: false,
        },
        {
            name: "operate all",
            payload: {
                created: "1690304916",
                query: "20200812220555-lj3enxa",
                op: "all",
                type: 3,
            },
            debug: false,
        },
        {
            name: "operate clean",
            payload: {
                created: "1690304916",
                query: "20200812220555-lj3enxa",
                op: "clean",
                type: 3,
            },
            debug: false,
        },
        {
            name: "operate update",
            payload: {
                created: "1690304916",
                query: "20200812220555-lj3enxa",
                op: "update",
                type: 3,
            },
            debug: false,
        },
        {
            name: "operate delete",
            payload: {
                created: "1690304916",
                query: "20200812220555-lj3enxa",
                op: "delete",
                type: 3,
            },
            debug: false,
        },
        {
            name: "operate format",
            payload: {
                created: "1690304916",
                query: "20200812220555-lj3enxa",
                op: "format",
                type: 3,
            },
            debug: false,
        },
        {
            name: "operate sync",
            payload: {
                created: "1690304916",
                query: "20200812220555-lj3enxa",
                op: "sync",
                type: 3,
            },
            debug: false,
        },
        {
            name: "operate replace",
            payload: {
                created: "1690304916",
                query: "20200812220555-lj3enxa",
                op: "replace",
                type: 3,
            },
            debug: false,
        },
    ];

    cases.forEach(item => {
        testKernelAPI<getHistoryItems.IPayload, getHistoryItems.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                validate: validate_payload,
                test: item.before,
            },
            request: (payload) => client.client.getHistoryItems(payload!),
            response: {
                validate: validate_response,
                test: item.after,
            },
            debug: item.debug,
        });
    });
});
