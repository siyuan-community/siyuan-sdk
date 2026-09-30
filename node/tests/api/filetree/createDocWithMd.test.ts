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

import type createDocWithMd from "@/types/kernel/api/filetree/createDocWithMd";

const pathname = Client.api.filetree.createDocWithMd.pathname;

describe(pathname, () => {
    const notebook = useNotebook("createDocWithMd");
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
    });

    it("main", async () => {
        const path = "/createDocWithMd";
        const markdown = "# createDocWithMd\n";
        const payload: createDocWithMd.IPayload = {
            notebook: notebook.id,
            path,
            markdown,
        };
        expectPayload(context.validators, payload);

        const response = await client.createDocWithMd(payload);
        expectResponse(context.validators, response);

        /* 导出内容是否带有 YAML Front Matter 取决于工作空间的导出设置，因此只检查正文 */
        const exported = await client.exportMdContent({ id: response.data });
        expect(exported.data.hPath).toBe(path);
        expect(exported.data.content).toContain(markdown);
    });
});
