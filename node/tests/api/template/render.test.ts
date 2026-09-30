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

import { join } from "node:path";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { expectPayload, expectResponse } from "~/tests/utils/assert";
import { removeFileIfExists, TEMPLATES_DIR } from "~/tests/utils/cleanup";
import { client } from "~/tests/utils/client";
import { env } from "~/tests/utils/env";
import { createDoc, uniqueName, useNotebook } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type render from "@/types/kernel/api/template/render";

const pathname = Client.api.template.render.pathname;

describe(pathname, () => {
    const notebook = useNotebook("render");
    /* 内核只渲染模板目录中的文件，因此模板文件放在该目录下，并在结束后删除 */
    const file = `${TEMPLATES_DIR}/${uniqueName("render")}.md`;
    const context = {
        validators: {} as IKernelAPIValidators,
        document: "", // 渲染模板时使用的文档 ID
        template: join(env.workspace, file), // 模板文件的文件系统路径
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        context.document = await createDoc(notebook.id, "/render");
        await client.putFile({
            path: file,
            file: `.action{now | date "2006-01-02 15:04:05.000"}`,
        });
    });

    afterAll(async () => {
        await removeFileIfExists(file);
    });

    it("main", async () => {
        const payload: render.IPayload = {
            id: context.document,
            path: context.template,
        };
        expectPayload(context.validators, payload);

        const response = await client.render(payload);
        expectResponse(context.validators, response);
        expect(response.data.path).toBe(context.template);
        expect(response.data.content).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}/);
    });
});
