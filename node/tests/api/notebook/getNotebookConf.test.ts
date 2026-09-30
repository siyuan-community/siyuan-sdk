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
import { useNotebook } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type getNotebookConf from "@/types/kernel/api/notebook/getNotebookConf";

const pathname = Client.api.notebook.getNotebookConf.pathname;

describe(pathname, () => {
    const notebook = useNotebook("getNotebookConf");
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
    });

    it("main", async () => {
        const payload: getNotebookConf.IPayload = { notebook: notebook.id };
        expectPayload(context.validators, payload);

        const response = await client.getNotebookConf(payload);
        expectResponse(context.validators, response);
        expect(response.data.box).toBe(notebook.id);
        expect(response.data.name).toBe(notebook.name);
        expect(response.data.conf.name).toBe(notebook.name);
    });
});
