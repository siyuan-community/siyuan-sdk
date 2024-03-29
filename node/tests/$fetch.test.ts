/**
 * Copyright (C) 2024 SiYuan Community
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
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */


import {
    describe,
    test,
    expect,
} from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";

import version from "@/types/kernel/api/system/version";

const pathname_version = client.Client.api.system.version.pathname;

describe("$fetch", async () => {
    const schema_response_version = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname_version));
    await schema_response_version.loadSchemaFile();
    const validate_response_version = schema_response_version.constructValidateFuction();

    const url = `${process.env.VITE_SIYUAN_SERVE}${pathname_version}`;
    const init: RequestInit = {
        headers: {
            Authorization: `Token ${process.env.VITE_SIYUAN_TOKEN}`
        },
    };

    test(`test GET ${pathname_version}`, async () => {
        const response = await client.client.$fetch(url, Object.assign<any, RequestInit>({
            method: "GET",
        }, init));
        const version: version.IResponse = await response.json();
        expect.soft(
            validate_response_version(version),
            "verify response text",
        ).toBeTruthy();
    });

    test(`test POST ${pathname_version}`, async () => {
        const response = await client.client.$fetch(url, Object.assign<any, RequestInit>({
            method: "POST",
            body: "{}",
        }, init));
        const version: version.IResponse = await response.json();
        expect.soft(
            validate_response_version(version),
            "verify response text",
        ).toBeTruthy();
    });
});
