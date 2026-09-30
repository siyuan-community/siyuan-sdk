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

import { beforeAll, describe, expect, it } from "vitest";

import { expectPayload, expectResponse } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type renderSprig from "@/types/kernel/api/template/renderSprig";

const pathname = Client.api.template.renderSprig.pathname;

describe(pathname, () => {
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
    });

    it("main", async () => {
        const payload: renderSprig.IPayload = {
            template: "/{{now | date \"2006/01\"}}/{{now | date \"2006-01-02\"}}",
        };
        expectPayload(context.validators, payload);

        const response = await client.renderSprig(payload);
        expectResponse(context.validators, response);
        expect(response.data).toMatch(/^\/\d{4}\/\d{2}\/\d{4}-\d{2}-\d{2}$/);
    });
});
