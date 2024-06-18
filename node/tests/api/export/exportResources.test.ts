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

import { afterAll, describe } from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import type exportResources from "@/types/kernel/api/export/exportResources";

const pathname = client.Client.api.export.exportResources.pathname;

interface ICase {
    name: string;
    before?: () => void;
    payload: exportResources.IPayload;
    after?: (response: exportResources.IResponse, payload: exportResources.IPayload) => void;
    debug: boolean;
}

const paths: string[] = []; // 测试生成的文件路径

describe(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const cases: ICase[] = [
        {
            name: "empty with name",
            payload: {
                paths: [],
                name: "test-empty",
            },
            debug: false,
        },
        {
            name: "files",
            payload: {
                paths: [
                    "temp/siyuan.log", //
                    "temp/pandoc/COPYING.rtf",
                    "temp/pandoc/COPYRIGHT.txt",
                    "temp/pandoc/MANUAL.html",
                ],
                name: "test-files",
            },
            debug: false,
        },
        {
            name: "folders",
            payload: {
                paths: [
                    "conf/appearance/boot", //
                    "conf/appearance/emojis",
                    "conf/appearance/icons/ant",
                    "conf/appearance/themes/midnight",
                ],
                name: "test-folders",
            },
            debug: false,
        },
        {
            name: "files + folders",
            payload: {
                paths: [
                    "temp/siyuan.log", //
                    "temp/pandoc/COPYING.rtf",
                    "temp/pandoc/COPYRIGHT.txt",
                    "temp/pandoc/MANUAL.html",
                    "conf/appearance/boot",
                    "conf/appearance/emojis",
                    "conf/appearance/icons/ant",
                    "conf/appearance/themes/midnight",
                ],
                name: "test-files+folders",
            },
            debug: false,
        },
    ];

    cases.forEach((item) => {
        testKernelAPI<exportResources.IPayload, exportResources.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                validate: validate_payload,
                test: item.before,
            },
            request: payload => client.client.exportResources(payload!),
            response: {
                validate: validate_response,
                test: (response) => {
                    paths.push(response.data.path);
                },
            },
            debug: item.debug,
        });
    });
});

// REF: https://cn.vitest.dev/api/#afterall
afterAll(async () => {
    /* 删除测试生成的 *.zip 文件 */
    paths.forEach((path) => {
        client.client.removeFile({
            path,
        });
    });
});
