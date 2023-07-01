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

import {
    describe,
    test,
    expect,
} from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import upload from "@/types/kernel/api/asset/upload";

const pathname = client.Client.api.asset.upload.pathname;

interface ICase {
    name: string,
    payload: upload.IPayload,
    debug: boolean,
}

describe.concurrent(pathname, async () => {
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_response.loadSchemaFile();
    const validate_response = schema_response.constructValidateFuction();

    const cases: ICase[] = [
        /* 测试上传单文件 */
        {
            name: "test upload file",
            payload: {
                files: [
                    new File(["test0.txt"], "test0.txt", { type: "text/plain" }),
                ],
            },
            debug: false,
        },
        /* 测试上传多个文件 */
        {
            name: "test upload files",
            payload: {
                files: [
                    new File(["test1.txt"], "test1.txt", { type: "text/plain" }),
                    new File(["test2.txt"], "test2.txt", { type: "text/plain" }),
                ],
            },
            debug: false,
        },
        /* 测试上传文件到次级目录中 */
        {
            name: "test upload files to sub dir",
            payload: {
                assetsDirPath: "/assets/dir1/dir2/",
                files: [
                    new File(["test3.txt"], "test3.txt", { type: "text/plain" }),
                    new File(["test4.txt"], "test4.txt", { type: "text/plain" }),
                ],
            },
            debug: false,
        },
    ];

    cases.forEach(item => {
        testKernelAPI<upload.IPayload, upload.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
            },
            request: (payload) => client.client.upload(payload!),
            response: {
                validate: validate_response,
                test: async (response, payload) => {
                    test("test the result of updating file", async () => {
                        /* 测试响应体中的结果 */
                        payload.files.map(file => file.name).forEach(filename => {
                            expect.soft(
                                response.data.succMap[filename],
                                `uploaded file "${filename}" failed`,
                            ).not.toBeUndefined();
                        });

                    });

                    /* 测试文件是是否能正常获取到 */
                    test("test the file is accessible", async () => {
                        for (const [filename, filepath] of Object.entries(response.data.succMap)) {
                            const path = `/data/${filepath}`;
                            await expect.soft(client.client.getFile({
                                path,
                            })).resolves.toEqual(filename);

                            /* 删除测试文件 */
                            await client.client.removeFile({
                                path,
                            });
                        }
                    });
                },
            },
            debug: item.debug,
        });
    });
});
