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

import CONSTANTS from "~/tests/constants";
import { expectKernelError, expectPayload } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import { useTempDir } from "~/tests/utils/fixtures";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type { ResponseType } from "@/client/Client";
import type getFile from "@/types/kernel/api/file/getFile";

const pathname = Client.api.file.getFile.pathname;

/* 测试文件内容 */
const BINARY = Uint8Array.from({ length: 256 }, (_, i) => i);
const JSON_CONTENT = { name: "getFile", list: [1, 2, 3] };

describe(pathname, () => {
    const dir = useTempDir("getFile");
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
        await client.putFile({ path: dir.resolve("binary.bin"), file: new Blob([BINARY]) });
        await client.putFile({ path: dir.resolve("data.json"), file: JSON.stringify(JSON_CONTENT) });
        await client.putFile({ path: dir.resolve("text.html"), file: CONSTANTS.TEST_FILE_CONTENT });
    });

    /**
     * 获取文件并校验请求体
     * @param path - 文件路径
     * @param responseType - 响应体类型
     */
    async function getFile(path: string, responseType: ResponseType): Promise<unknown> {
        const payload: getFile.IPayload = { path };
        expectPayload(context.validators, payload);
        return client.getFile(payload, responseType);
    }

    /**
     * 读取流中的全部数据
     * @param stream - 可读流
     */
    async function readStream(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
        return new Uint8Array(await new Response(stream).arrayBuffer());
    }

    describe("binary file", () => {
        it("arraybuffer", async () => {
            const body = await getFile(dir.resolve("binary.bin"), "arraybuffer");
            expect(body).toBeInstanceOf(ArrayBuffer);
            expect(new Uint8Array(body as ArrayBuffer)).toEqual(BINARY);
        });

        it("blob", async () => {
            const body = await getFile(dir.resolve("binary.bin"), "blob");
            expect(body).toBeInstanceOf(Blob);
            expect(new Uint8Array(await (body as Blob).arrayBuffer())).toEqual(BINARY);
        });

        it("text", async () => {
            const body = await getFile(dir.resolve("binary.bin"), "text");
            expect(body).toBeTypeOf("string");
        });

        it("stream", async () => {
            const body = await getFile(dir.resolve("binary.bin"), "stream");
            expect(body).toBeInstanceOf(ReadableStream);
            expect(await readStream(body as ReadableStream<Uint8Array>)).toEqual(BINARY);
        });
    });

    describe("json file", () => {
        it("json", async () => {
            await expect(getFile(dir.resolve("data.json"), "json")).resolves.toEqual(JSON_CONTENT);
        });

        it("text", async () => {
            await expect(getFile(dir.resolve("data.json"), "text")).resolves.toBe(JSON.stringify(JSON_CONTENT));
        });

        it("stream", async () => {
            const body = await getFile(dir.resolve("data.json"), "stream");
            expect(body).toBeInstanceOf(ReadableStream);
            expect(new TextDecoder().decode(await readStream(body as ReadableStream<Uint8Array>))).toBe(JSON.stringify(JSON_CONTENT));
        });
    });

    describe("text file", () => {
        it("text", async () => {
            await expect(getFile(dir.resolve("text.html"), "text")).resolves.toBe(CONSTANTS.TEST_FILE_CONTENT);
        });

        it("stream", async () => {
            const body = await getFile(dir.resolve("text.html"), "stream");
            expect(body).toBeInstanceOf(ReadableStream);
            expect(new TextDecoder().decode(await readStream(body as ReadableStream<Uint8Array>))).toBe(CONSTANTS.TEST_FILE_CONTENT);
        });
    });

    describe("errors", () => {
        it("path outside the workspace", async () => {
            await expectKernelError(getFile("/..//none-existent", "json"), 403);
        });

        it("non-existent file", async () => {
            await expectKernelError(getFile(dir.resolve("none-existent"), "json"), 404);
        });

        it("directory", async () => {
            await expectKernelError(getFile(dir.path, "json"), 409);
        });
    });
});
