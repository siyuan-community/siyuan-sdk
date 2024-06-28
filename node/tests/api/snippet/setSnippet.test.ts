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

import { describe, expect, it } from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import type setSnippet from "@/types/kernel/api/snippet/setSnippet";

const pathname = client.Client.api.snippet.setSnippet.pathname;

interface ICase {
    name: string;
    before?: () => void;
    payload: setSnippet.IPayload;
    after?: (response: setSnippet.IResponse, payload: setSnippet.IPayload) => void;
    debug: boolean;
}

describe.concurrent(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const cases: ICase[] = [
        {
            name: "main test",
            payload: {
                snippets: [
                    {
                        id: "20230725235727-lvt3puk",
                        name: "test-setSnippet-css-1",
                        type: "css",
                        enabled: true,
                        content: "/* test-setSnippet-css-1 */",
                    },
                    {
                        id: "",
                        name: "test-setSnippet-js-1",
                        type: "js",
                        enabled: false,
                        content: "// test-setSnippet-js-1",
                    },
                ],
            },
            after: async (_response, payload) => {
                it("test the result of set snippet", async () => {
                    for (const snippet of payload.snippets) {
                        await expect((await fetch(`${process.env.VITE_SIYUAN_SERVE}/snippets/${snippet.name}.${snippet.type}`)).text()).resolves.toEqual(snippet.content);
                    }
                });
            },
            debug: false,
        },
    ];

    cases.forEach((item) => {
        testKernelAPI<setSnippet.IPayload, setSnippet.IResponse>({
            name: "main",
            payload: {
                data: item.payload,
                validate: validate_payload,
                test: item.before,
            },
            request: (payload) => client.client.setSnippet(payload!),
            response: {
                validate: validate_response,
                test: item.after,
            },
            debug: item.debug,
        });
    });
});
