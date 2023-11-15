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
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import setSnippet from "@/types/kernel/api/snippet/setSnippet";
import getSnippet from "@/types/kernel/api/snippet/getSnippet";

const pathname = client.Client.api.snippet.getSnippet.pathname;

interface ICase {
    name: string,
    before?: () => void,
    payload: getSnippet.IPayload,
    after?: (response: getSnippet.IResponse, payload: getSnippet.IPayload) => void,
    debug: boolean,
}

describe.concurrent(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const snippets: setSnippet.IPayload["snippets"] = [
        {
            id: "20230725235727-lvt3puk",
            name: "test-getSnippet-css-1",
            type: "css",
            enabled: true,
            content: "/* test-getSnippet-css-1 */"
        },
        {
            id: "",
            name: "test-getSnippet-js-1",
            type: "js",
            enabled: false,
            content: "// test-getSnippet-js-1"
        }
    ];
    const cases: ICase[] = [
        {
            name: "main test",
            before: async () => {
                await client.client.setSnippet({
                    snippets,
                });
            },
            payload: {
                type: "all",
                enabled: 2,
            },
            after: async (response) => {
                test("test the result of get snippet", async () => {
                    for (const snippet of response.data.snippets) {
                        const s = snippets.find(s => s.name === snippet.name);
                        expect(s).not.toBeUndefined();
                        if (s) {
                            if (s.id !== "") {
                                expect.soft(s.id, "snippet.id").toEqual(snippet.id);
                            }
                            expect.soft(s.name, "snippet.name").toEqual(snippet.name);
                            expect.soft(s.type, "snippet.type").toEqual(snippet.type);
                            expect.soft(s.enabled, "snippet.enabled").toEqual(snippet.enabled);
                            expect.soft(s.content, "snippet.content").toEqual(snippet.content);
                        }
                    }
                });
            },
            debug: false,
        },
    ];

    cases.forEach(item => {
        testKernelAPI<getSnippet.IPayload, getSnippet.IResponse>({
            name: "main",
            payload: {
                data: item.payload,
                validate: validate_payload,
                test: item.before,
            },
            request: (payload) => client.client.getSnippet(payload!),
            response: {
                validate: validate_response,
                test: item.after,
            },
            debug: item.debug,
        });
    });
});
