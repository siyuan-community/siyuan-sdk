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

import { describe, expect, it } from "vitest";

import constants from "~/tests/constants";
import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import type renameFile from "@/types/kernel/api/file/renameFile";

const pathname = client.Client.api.file.renameFile.pathname;

interface ICase {
    name: string;
    before?: () => void;
    payload: renameFile.IPayload;
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
            name: "rename file",
            before: async () => {
                /* 删除可能已存在的测试文件 */
                for (const path of [
                    "/temp/convert/pandoc/test/rename-file/",
                ]) {
                    try {
                        await client.client.removeFile({
                            path,
                        });
                    }
                    catch (error) {}
                }

                /* 写入测试文件 */
                await client.client.putFile({
                    path: "/temp/convert/pandoc/test/rename-file/test.html",
                    file: constants.TEST_FILE_CONTENT,
                });
            },
            payload: {
                path: "/temp/convert/pandoc/test/rename-file/test.html", // 移动文件测试
                newPath: "/temp/convert/pandoc/test/rename-file/test-new.html",
            },
            after: () => {
                it("test the result of renaming file", async () => {
                    /* 测试原文件是否存在 */
                    await expect(
                        client.client.getFile(
                            {
                                path: "/temp/convert/pandoc/test/rename-file/test.html",
                            },
                            "json",
                        ),
                        `original path: /temp/convert/pandoc/test/rename-file/test.html`,
                    ).rejects.toMatchObject({ code: 404 });

                    /* 测试重命名后文件是否存在 */
                    await expect(
                        client.client.getFile(
                            {
                                path: "/temp/convert/pandoc/test/rename-file/test-new.html",
                            },
                            "text",
                        ),
                        `new path: /temp/convert/pandoc/test/rename-file/test-new.html`,
                    ).resolves.toEqual(constants.TEST_FILE_CONTENT);
                });
            },
            debug: false,
        },
        {
            name: "rename directory",
            before: async () => {
                /* 删除可能已存在的测试文件 */
                for (const path of [
                    "/temp/convert/pandoc/test/rename-dir/", //
                    "/temp/convert/pandoc/test/rename-dir-new/",
                ]) {
                    try {
                        await client.client.removeFile({
                            path,
                        });
                    }
                    catch (error) {}
                }

                /* 写入测试文件 */
                await client.client.putFile({
                    path: "/temp/convert/pandoc/test/rename-dir/",
                    isDir: true,
                });
            },
            payload: {
                path: "/temp/convert/pandoc/test/rename-dir/", // 移动目录测试
                newPath: "/temp/convert/pandoc/test/rename-dir-new/",
            },
            after: () => {
                it("test the result of renaming directory", async () => {
                    /* 测试原目录是否存在 */
                    await expect(
                        client.client.readDir({
                            path: "/temp/convert/pandoc/test/rename-dir/",
                        }),
                        `original path: /temp/convert/pandoc/test/rename-dir/`,
                    ).rejects.toMatchObject({ code: 404 });

                    /* 测试重命名后目录是否存在 */
                    await expect(
                        client.client.readDir({
                            path: "/temp/convert/pandoc/test/rename-dir-new/",
                        }),
                        `new path: /temp/convert/pandoc/test/rename-dir-new/`,
                    ).resolves.toMatchObject({ code: 0 });
                });
            },
            debug: false,
        },
    ];

    cases.forEach((item) => {
        testKernelAPI<renameFile.IPayload, renameFile.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                validate: validate_payload,
                test: item.before,
            },
            request: (payload) => client.client.renameFile(payload!),
            response: {
                validate: validate_response,
                test: item.after,
            },
            debug: item.debug,
        });
    });
});
