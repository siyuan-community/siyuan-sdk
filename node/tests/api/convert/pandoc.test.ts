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
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import pandoc from "@/types/kernel/api/convert/pandoc";

const pathname = client.Client.api.convert.pandoc.pathname;

interface ICase {
    dir?: string,
    debug: boolean,
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
            dir: "test",
            debug: true,
        },
        {
            debug: true,
        },
    ];

    cases.forEach(item => {
        testKernelAPI<pandoc.IPayload, pandoc.IResponse>({
            name: "main",
            payload: {
                data: {
                    dir: item.dir,
                    args: [
                        "-h",
                    ],
                },
                validate: validate_payload,
            },
            request: (payload) => client.client.pandoc(payload!),
            response: {
                validate: validate_response,
            },
            debug: item.debug,
        });
    });
});