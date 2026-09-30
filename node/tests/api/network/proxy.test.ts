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

import { Buffer } from "node:buffer";
import { EventEmitter, once } from "node:events";

import { describe, expect, it } from "vitest";

import { expectKernelError } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import { getClosedPort, useUpstream } from "~/tests/utils/upstream";

import { Client } from "@/client/Client";

import type { ServerResponse } from "node:http";

const pathname = Client.api.network.proxy.pathname;

/* 包含所有字节值的二进制数据 */
const BINARY = Uint8Array.from({ length: 256 }, (_, i) => i);

/* 目标服务器缓存的实体标签 */
const ETAG = "\"siyuan-sdk-test\"";

describe(pathname, () => {
    /* 目标服务器收到 /slow 请求时触发 slow 事件，参数为未结束的响应 */
    const events = new EventEmitter();
    const upstream = useUpstream({
        http: (request, response) => {
            const url = new URL(request.url!, "http://127.0.0.1");
            switch (url.pathname) {
                /* 以 JSON 返回收到的请求 */
                case "/echo": {
                    const chunks: Buffer[] = [];
                    request.on("data", (chunk: Buffer) => chunks.push(chunk));
                    request.on("end", () => {
                        response.writeHead(201, { "Content-Type": "application/json", "X-Upstream": "echo" });
                        response.end(JSON.stringify({
                            method: request.method,
                            url: request.url,
                            headers: request.headersDistinct,
                            body: Buffer.concat(chunks).toString(),
                        }));
                    });
                    break;
                }

                /* 原样返回请求体 */
                case "/reflect":
                    response.writeHead(200, { "Content-Type": request.headers["content-type"] ?? "application/octet-stream" });
                    request.pipe(response);
                    break;

                case "/binary":
                    response.writeHead(200, { "Content-Type": "application/octet-stream", "X-Upstream": "binary" });
                    response.end(BINARY);
                    break;

                case "/empty":
                    response.writeHead(204, { "X-Upstream": "empty" });
                    response.end();
                    break;

                case "/cached":
                    if (request.headers["if-none-match"] === ETAG) {
                        response.writeHead(304, { ETag: ETAG });
                        response.end();
                    }
                    else {
                        response.writeHead(200, { "Content-Type": "text/plain", "ETag": ETAG });
                        response.end("cached");
                    }
                    break;

                /* 不返回响应，由客户端中止请求 */
                case "/slow":
                    events.emit("slow", response);
                    break;

                default:
                    response.writeHead(404, { "Content-Type": "text/plain" });
                    response.end("not found");
                    break;
            }
        },
    });

    it("forward the request method, URL, headers and body", async () => {
        const response = await client.httpProxy(`${upstream.url}/echo?foo=bar&baz=%E4%B8%AD`, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
                "User-Agent": "siyuan-sdk-test",
                "X-SiYuan-SDK-Test": "hello",
            },
            body: "request body",
        });
        expect(response.status, "status").toBe(201);
        expect(response.headers.get("Content-Type"), "response header Content-Type").toBe("application/json");
        expect(response.headers.get("X-Upstream"), "response header X-Upstream").toBe("echo");

        const echo = await response.json();
        expect(echo.method, "method").toBe("POST");
        expect(echo.url, "URL").toBe("/echo?foo=bar&baz=%E4%B8%AD");
        expect(echo.body, "body").toBe("request body");
        expect(echo.headers["content-type"], "request header Content-Type").toEqual(["text/plain"]);
        expect(echo.headers["user-agent"], "request header User-Agent").toEqual(["siyuan-sdk-test"]);
        expect(echo.headers["x-siyuan-sdk-test"], "request header X-SiYuan-SDK-Test").toEqual(["hello"]);
        expect(echo.headers, "API token is not forwarded").not.toHaveProperty("authorization");
    });

    it("forward a Request object", async () => {
        const request = new Request(`${upstream.url}/echo`, {
            method: "PUT",
            headers: { "X-SiYuan-SDK-Test": "request" },
            body: new URLSearchParams({ foo: "bar" }),
        });
        const echo = await (await client.httpProxy(request)).json();
        expect(echo.method, "method").toBe("PUT");
        expect(echo.body, "body").toBe("foo=bar");
        expect(echo.headers["content-type"], "Content-Type derived from the body").toEqual(["application/x-www-form-urlencoded;charset=UTF-8"]);
        expect(echo.headers["x-siyuan-sdk-test"], "request header X-SiYuan-SDK-Test").toEqual(["request"]);
    });

    it("replace the headers of a Request object with init.headers", async () => {
        const request = new Request(`${upstream.url}/echo`, { headers: { "X-SiYuan-SDK-Test": "request" } });
        const echo = await (await client.httpProxy(request, { headers: { "X-SiYuan-SDK-Test-Init": "init" } })).json();
        expect(echo.headers["x-siyuan-sdk-test-init"], "header of init").toEqual(["init"]);
        expect(echo.headers, "header of the Request object").not.toHaveProperty("x-siyuan-sdk-test");
    });

    it("transfer binary request and response bodies", async () => {
        const body = Uint8Array.from({ length: 256 * 1024 }, (_, i) => i % 256);
        const response = await client.httpProxy(`${upstream.url}/reflect`, {
            method: "POST",
            headers: { "Content-Type": "application/octet-stream" },
            body,
        });
        expect(response.status, "status").toBe(200);
        expect(response.headers.get("Content-Type"), "response header Content-Type").toBe("application/octet-stream");
        const received = Buffer.from(await response.arrayBuffer());
        expect(received.length, "body length").toBe(body.length);
        expect(received.equals(body), "body content").toBe(true);
    });

    it("request with GET and HEAD methods", async () => {
        const get = await client.httpProxy(`${upstream.url}/binary`);
        expect(get.status, "GET status").toBe(200);
        expect(new Uint8Array(await get.arrayBuffer()), "GET body").toEqual(BINARY);

        const head = await client.httpProxy(`${upstream.url}/binary`, { method: "HEAD" });
        expect(head.status, "HEAD status").toBe(200);
        expect(head.headers.get("X-Upstream"), "HEAD response header").toBe("binary");
        expect(head.body, "HEAD body").toBeNull();
    });

    it("return responses without body", async () => {
        const empty = await client.httpProxy(`${upstream.url}/empty`, { method: "DELETE" });
        expect(empty.status, "204 status").toBe(204);
        expect(empty.headers.get("X-Upstream"), "204 response header").toBe("empty");
        expect(empty.body, "204 body").toBeNull();

        const cached = await client.httpProxy(`${upstream.url}/cached`, { headers: { "If-None-Match": ETAG } });
        expect(cached.status, "304 status").toBe(304);
        expect(cached.headers.get("ETag"), "304 response header").toBe(ETAG);
        expect(cached.body, "304 body").toBeNull();
    });

    it("return error statuses of the target server", async () => {
        const response = await client.httpProxy(`${upstream.url}/none`);
        expect(response.ok, "ok").toBe(false);
        expect(response.status, "status").toBe(404);
        await expect(response.text(), "body").resolves.toBe("not found");
    });

    it("abort an in-flight request", async () => {
        const controller = new AbortController();
        const arrived = once(events, "slow") as Promise<[ServerResponse]>;
        const promise = client.httpProxy(`${upstream.url}/slow`, { signal: controller.signal });

        const [response] = await arrived;
        const closed = once(response, "close");
        controller.abort();
        await expect(promise, "request is aborted").rejects.toMatchObject({ name: "AbortError" });
        /* 内核在客户端中止请求后断开与目标服务器的连接 */
        await expect(closed, "upstream connection is closed").resolves.toBeDefined();
    });

    it("use init.signal or the signal of the Request object", async () => {
        const aborted = (): Request => new Request(`${upstream.url}/echo`, { signal: AbortSignal.abort() });
        await expect(client.httpProxy(aborted()), "signal of the Request object").rejects.toMatchObject({ name: "AbortError" });

        const response = await client.httpProxy(aborted(), { signal: null });
        expect(response.status, "init.signal overrides the signal of the Request object").toBe(201);
        await response.body?.cancel();
    });

    it("reject target URLs that are not http/https", async () => {
        const error = await expectKernelError(client.httpProxy("ftp://127.0.0.1/"), -1);
        expect(error.response?.status, "status").toBe(400);
    });

    it("reject when the target server is unreachable", async () => {
        const port = await getClosedPort();
        const error = await expectKernelError(client.httpProxy(`http://127.0.0.1:${port}/`), -1);
        expect(error.response?.status, "status").toBe(502);
    });
});
