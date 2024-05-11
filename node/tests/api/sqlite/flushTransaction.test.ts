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
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { describe } from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import flushTransaction from "@/types/kernel/api/sqlite/flushTransaction";

const pathname = client.Client.api.sqlite.flushTransaction.pathname;

describe(pathname, async () => {
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_response.loadSchemaFile();
    const validate_response = schema_response.constructValidateFuction();

    testKernelAPI<never, flushTransaction.IResponse>({
        name: "main",
        request: (payload) => client.client.flushTransaction(payload!),
        response: {
            validate: validate_response,
        },
        debug: false,
    });
});
