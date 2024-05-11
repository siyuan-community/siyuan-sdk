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

import removeFile from "@/types/kernel/api/file/removeFile";

const pathname = client.Client.api.file.removeFile.pathname;

interface ICase {
    name: string;
    before?: () => void;
    payload: removeFile.IPayload;
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
            name: "test remove file",
            before: async () => {
                /* 写入测试文件 */
                await client.client.putFile({
                    path: "/temp/convert/test/remove-file/test.html",
                    file: constants.TEST_FILE_CONTENT,
                });
            },
            payload: {
                path: "/temp/convert/test/remove-file/test.html", // 移除文件测试
            },
            after: () => {
                test("test the result of removing file", async () => {
                    await expect(
                        client.client.getFile(
                            {
                                path: "/temp/convert/test/remove-file/test.html",
                            },
                            "json",
                        ),
                    ).rejects.toMatchObject({ code: 404 });
                });
            },
            debug: false,
        },
        {
            name: "test remove dir",
            before: async () => {
                /* 写入测试目录 */
                await client.client.putFile({
                    path: "/temp/convert/test/remove-dir/",
                    isDir: true,
                });
            },
            payload: {
                path: "/temp/convert/test/remove-dir/", // 移除目录测试
            },
            after: () => {
                test("test the result of removing directory", async () => {
                    await expect(
                        client.client.readDir({
                            path: "/temp/convert/test/remove-dir/",
                        }),
                    ).rejects.toMatchObject({ code: 404 });
                });
            },
            debug: false,
        },
    ];

    cases.forEach((item) => {
        testKernelAPI<removeFile.IPayload, removeFile.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                validate: validate_payload,
                test: item.before,
            },
            request: (payload) => client.client.removeFile(payload!),
            response: {
                validate: validate_response,
                test: item.after,
            },
            debug: item.debug,
        });
    });
});
