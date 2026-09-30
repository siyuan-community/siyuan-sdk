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

import type openNotebook from "@/types/kernel/api/notebook/openNotebook";

const pathname = Client.api.notebook.openNotebook.pathname;

describe(pathname, () => {
    const notebook = useNotebook("openNotebook");
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        await client.closeNotebook({ notebook: notebook.id });
    });

    it("open a closed notebook", async () => {
        const payload: openNotebook.IPayload = { notebook: notebook.id };
        expectPayload(context.validators, payload);

        const response = await client.openNotebook(payload);
        expectResponse(context.validators, response);

        const conf = await client.getNotebookConf({ notebook: notebook.id });
        expect(conf.data.conf.closed).toBe(false);
    });
});
