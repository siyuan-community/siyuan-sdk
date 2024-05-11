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

import { describe, expect, test } from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import setLocalStorage from "@/types/kernel/api/storage/setLocalStorage";

const pathname = client.Client.api.storage.setLocalStorage.pathname;

describe(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const response = await client.client.getLocalStorage();
    const key = "test-setLocalStorage";
    const val = globalThis.crypto.randomUUID();
    response.data[key] = val;

    testKernelAPI<setLocalStorage.IPayload, setLocalStorage.IResponse>({
        name: "main",
        payload: {
            data: {
                app: "01234",
                val: response.data,
            },
            validate: validate_payload,
        },
        request: (payload) => client.client.setLocalStorage(payload!),
        response: {
            validate: validate_response,
            test: async () => {
                test("test the result of set local storage", async () => {
                    await expect(client.client.getLocalStorage()).resolves.toEqual(response);
                });
            },
        },
        debug: false,
    });
});
