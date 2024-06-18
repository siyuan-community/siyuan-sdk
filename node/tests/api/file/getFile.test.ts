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

import { KernelError } from "~/src";
import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import type { ResponseType } from "@/client/Client";
import type getFile from "@/types/kernel/api/file/getFile";

const pathname = client.Client.api.file.getFile.pathname;

interface ICase {
    name: string;
    path: string;
    responseType: ResponseType;
    type: string;
    protoType?: any;
    catch?: (err: unknown) => void;
    debug: boolean;
}

describe.concurrent(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();

    const cases: ICase[] = [
        {
            name: "arraybuffer-icon.png",
            path: "/conf/appearance/boot/icon.png", // 二进制文件
            responseType: "arraybuffer",
            type: "object",
            protoType: ArrayBuffer,
            debug: false,
        },
        {
            name: "blob-icon.png",
            path: "/conf/appearance/boot/icon.png", // 二进制文件
            responseType: "blob",
            type: "object",
            protoType: Blob,
            debug: false,
        },
        {
            name: "text-icon.png",
            path: "/conf/appearance/boot/icon.png", // 二进制文件
            responseType: "text",
            type: "string",
            debug: false,
        },
        {
            name: "stream-icon.png",
            path: "/conf/appearance/boot/icon.png", // 二进制文件
            responseType: "stream",
            type: "object",
            protoType: ReadableStream,
            debug: false,
        },
        {
            name: "json-theme.json",
            path: "/conf/appearance/themes/daylight/theme.json", // json 文件
            responseType: "json",
            type: "object",
            protoType: Object,
            debug: false,
        },
        {
            name: "text-theme.json",
            path: "/conf/appearance/themes/daylight/theme.json", // json 文件
            responseType: "text",
            type: "string",
            debug: false,
        },
        {
            name: "stream-theme.json",
            path: "/conf/appearance/themes/daylight/theme.json", // json 文件
            responseType: "stream",
            type: "object",
            protoType: ReadableStream,
            debug: false,
        },
        {
            name: "text-siyuan.log",
            path: "/temp/siyuan.log", // 纯文本文件
            responseType: "text",
            type: "string",
            debug: false,
        },
        {
            name: "stream-siyuan.log",
            path: "/temp/siyuan.log", // 纯文本文件
            responseType: "stream",
            type: "object",
            protoType: ReadableStream,
            debug: false,
        },
        {
            name: "json-out-workspace",
            path: "/..//none-existent", // 不存在的文件
            responseType: "json",
            type: "object", // 返回 { code: 404, msg: 'file is a directory', data: null }
            catch: (error) => {
                it("kernelError: 403", async () => {
                    expect(error, "error's type").toBeInstanceOf(KernelError);
                    expect((error as KernelError).code, "error's code").toEqual(403);
                });
            },
            debug: false,
        },
        {
            name: "json-non-existent",
            path: "/none-existent", // 不存在的文件
            responseType: "json",
            type: "object", // 返回 { code: 404, msg: 'file is a directory', data: null }
            catch: (error) => {
                it("kernelError: 404", async () => {
                    expect(
                        error, //
                        "error's type",
                    ).toBeInstanceOf(KernelError);
                    expect(
                        (error as KernelError).code, //
                        "error's code",
                    ).toEqual(404);
                });
            },
            debug: false,
        },
        {
            name: "json-dir",
            path: "/temp", // 目录
            responseType: "json",
            type: "object", // 返回 { code: 405, msg: 'file [/temp] is a directory', data: null }
            catch: (error) => {
                it("kernelError: 405", async () => {
                    expect(
                        error, //
                        "error's type",
                    ).toBeInstanceOf(KernelError);
                    expect(
                        (error as KernelError).code, //
                        "error's code",
                    ).toEqual(405);
                });
            },
            debug: false,
        },
    ];

    cases.forEach((item) => {
        testKernelAPI<getFile.IPayload, unknown>({
            name: item.name,
            payload: {
                data: {
                    path: item.path, // 数据
                },
                validate: validate_payload,
            },
            request: payload => client.client.getFile(payload!, item.responseType),
            catch: item.catch,
            response: {
                test: (body) => {
                    if (item.debug) {
                        // eslint-disable-next-line no-console
                        console.debug(body);
                    }
                    it("response body type verify", () => {
                        expect.soft(typeof body, "typeof").toEqual(item.type);
                        if (item.protoType) {
                            expect.soft(body, "instanceof").toBeInstanceOf(item.protoType);
                        }
                    });
                },
            },
            debug: item.debug,
        });
    });
});
