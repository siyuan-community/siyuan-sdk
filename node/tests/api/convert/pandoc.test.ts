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

import constants from "~/tests/constants";
import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import pandoc from "@/types/kernel/api/convert/pandoc";

const pathname = client.Client.api.convert.pandoc.pathname;

interface ICase {
    name: string;
    before?: () => void;
    payload: pandoc.IPayload;
    after?: () => void;
    debug: boolean;
}

describe.concurrent(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const cases: ICase[] = [
        {
            name: "test pandoc",
            payload: {
                args: ["-h"],
            },
            debug: false,
        },
        {
            name: "test convert",
            before: async () => {
                try {
                    /* 删除可能已存在的测试文件 */
                    await client.client.removeFile({
                        path: `${constants.PANDOC_CONVERT_DIR_PATH}/convert-test/`,
                    });
                } catch (error) {}

                /* 写入测试文件 */
                await client.client.putFile({
                    path: `${constants.PANDOC_CONVERT_DIR_PATH}/convert-test/test.html`,
                    file: constants.TEST_FILE_CONTENT,
                });
            },
            payload: {
                dir: "convert-test",
                args: ["--to", "gfm-raw_html+tex_math_dollars+pipe_tables", "test.html", "-o", "test.md"],
            },
            after: async () => {
                test("test the result of pandoc converting", async () => {
                    await expect(
                        client.client.getFile(
                            {
                                path: `${constants.PANDOC_CONVERT_DIR_PATH}/convert-test/test.md`,
                            },
                            "text",
                        ),
                    ).resolves.toBeTypeOf("string");
                });
            },
            debug: false,
        },
    ];

    cases.forEach((item) => {
        testKernelAPI<pandoc.IPayload, pandoc.IResponse>({
            name: "main",
            payload: {
                data: item.payload,
                validate: validate_payload,
                test: item.before,
            },
            request: (payload) => client.client.pandoc(payload!),
            response: {
                validate: validate_response,
                test: item.after,
            },
            debug: item.debug,
        });
    });
});
