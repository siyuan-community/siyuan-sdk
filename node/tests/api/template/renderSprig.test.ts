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

import type renderSprig from "@/types/kernel/api/template/renderSprig";

const pathname = client.Client.api.template.renderSprig.pathname;

describe(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    testKernelAPI<renderSprig.IPayload, renderSprig.IResponse>({
        name: "main",
        payload: {
            data: {
                template: "/{{now | date \"2006/01\"}}/{{now | date \"2006-01-02\"}}",
            },
            validate: validate_payload,
        },
        request: (payload) => client.client.renderSprig(payload!),
        response: {
            validate: validate_response,
            test: (response) => {
                it("test the result of Sprig template", () => {
                    expect(response.data).toMatch(/^\/\d{4}\/\d{2}\/\d{4}-\d{2}-\d{2}$/);
                });
            },
        },
    });
});
