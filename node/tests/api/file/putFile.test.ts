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

import constants from "~/tests/constants";
import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import type putFile from "@/types/kernel/api/file/putFile";

const pathname = client.Client.api.file.putFile.pathname;

interface ICase {
    name: string;
    payload: putFile.IPayload;
    debug: boolean;
}

describe.concurrent(pathname, async () => {
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_response.loadSchemaFile();
    const validate_response = schema_response.constructValidateFuction();

    const cases: ICase[] = [
        {
            name: "create dir",
            payload: {
                path: "/temp/convert/test",
                isDir: true,
            },
            debug: false,
        },
        {
            name: "create file with string",
            payload: {
                path: "/temp/convert/test/test0.html",
                file: constants.TEST_FILE_CONTENT,
            },
            debug: false,
        },
        {
            name: "create file with custom modified time",
            payload: {
                path: "/temp/convert/test/test1.html",
                file: constants.TEST_FILE_CONTENT,
                modTime: new Date("2001-02-03T04:05:06.007Z").getTime(),
            },
            debug: false,
        },
        {
            name: "create file with Blob",
            payload: {
                path: "/temp/convert/test/test2.html",
                file: new Blob([
                    constants.TEST_FILE_CONTENT,
                ]),
            },
            debug: false,
        },
        {
            name: "create file with File",
            payload: {
                path: "/temp/convert/test/test3.html",
                file: new File(
                    [
                        constants.TEST_FILE_CONTENT,
                    ],
                    "test3.html",
                ),
            },
            debug: false,
        },
    ];

    cases.forEach((item) => {
        testKernelAPI<putFile.IPayload, putFile.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
            },
            request: (payload) => client.client.putFile(payload!),
            response: {
                validate: validate_response,
                test: async () => {
                    it("test the result of put file", async () => {
                        if (item.payload.isDir) {
                            /* 测试目录是否存在 */
                            await expect(
                                client.client.readDir({
                                    path: item.payload.path,
                                }),
                                `dir path: ${item.payload.path}`,
                            ).resolves.toMatchObject({ code: 0 });
                        }
                        else {
                            /* 测试文件是否存在 */
                            await expect(
                                client.client.getFile(
                                    {
                                        path: item.payload.path,
                                    },
                                    "text",
                                ),
                                `file path: ${item.payload.path}`,
                            ).resolves.toEqual(constants.TEST_FILE_CONTENT);
                        }
                    });
                },
            },
            debug: item.debug,
        });
    });
});
