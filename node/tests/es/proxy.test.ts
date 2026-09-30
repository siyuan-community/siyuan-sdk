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
import { randomUUID } from "node:crypto";

import { describe, expect, it, onTestFinished, vi } from "vitest";

import { client } from "~/tests/utils/client";
import { env } from "~/tests/utils/env";
import { FetchEventSource } from "~/tests/utils/eventsource";
import { useUpstream } from "~/tests/utils/upstream";

import { Client } from "@/client/Client";

import type { ServerResponse } from "node:http";

const pathname = Client.es.network.proxy.pathname;

/* 只记录构造参数、不建立连接的 EventSource */
class CaptureEventSource extends FetchEventSource {
    protected override async _connect(): Promise<void> {
        /* 不建立连接 */
    }
}

/**
 * 等待 EventSource 收到指定类型的下一个事件
 * @param es - EventSource 连接
 * @param type - 事件类型
 * @returns 事件
 */
async function nextEvent(es: EventTarget, type: string): Promise<MessageEvent> {
    return new Promise((resolve, reject) => {
        es.addEventListener(type, (event) => resolve(event as MessageEvent), { once: true });
        es.addEventListener("error", () => reject(new Error(`The connection failed before receiving a ${type} event`)), { once: true });
    });
}

/**
 * 等待 EventSource 连接失败
 * @param es - EventSource 连接
 * @returns error 事件
 */
async function waitForError(es: EventTarget): Promise<Event> {
    return new Promise((resolve, reject) => {
        es.addEventListener("error", resolve, { once: true });
        es.addEventListener("message", (event) => reject(new Error(`Unexpected message: ${(event as MessageEvent).data}`)), { once: true });
    });
}

describe(pathname, () => {
    /* 目标服务器上尚未结束的事件流，键为请求的查询参数 id */
    const streams = new Map<string, ServerResponse>();
    const upstream = useUpstream({
        http: (request, response) => {
            const url = new URL(request.url!, "http://127.0.0.1");
            if (url.pathname !== "/events") {
                response.writeHead(404, { "Content-Type": "text/plain" });
                response.end("not found");
                return;
            }

            response.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" });
            /* 第一个事件的数据为目标服务器收到的请求头 */
            const headers = {
                accept: request.headers.accept,
                test: request.headers["x-siyuan-sdk-test"],
                authorization: request.headers.authorization ?? null,
            };
            response.write(`id: 1\nevent: greeting\ndata: ${JSON.stringify(headers)}\n\n`);
            streams.set(url.searchParams.get("id") ?? "", response);
        },
    });

    it("relay events from the target server in real time", async () => {
        const id = randomUUID();
        const es = client.esProxy(`${upstream.url}/events?id=${id}`, {
            EventSource: FetchEventSource,
            headers: { "X-SiYuan-SDK-Test": "hello" },
        });
        onTestFinished(() => es.close());

        const greeting = await nextEvent(es, "greeting");
        expect(greeting.lastEventId, "event id").toBe("1");
        expect(JSON.parse(greeting.data), "request headers received by the target server").toEqual({
            accept: "text/event-stream",
            test: "hello",
            authorization: null,
        });

        /* 客户端收到第一个事件后目标服务器才发送第二个事件，验证内核逐块转发事件流 */
        const message = nextEvent(es, "message");
        streams.get(id)!.write("data: line 1\ndata: line 2\n\n");
        expect((await message).data, "multi-line data").toBe("line 1\nline 2");
    });

    it("pass the target URL, headers, timeout and API token in the query", () => {
        const target = "https://example.com/events?foo=bar";
        const es = client.esProxy(
            target,
            {
                EventSource: CaptureEventSource,
                headers: { "X-SiYuan-SDK-Test": "hello" },
                withCredentials: true,
            },
            { timeout: 500 },
        );

        const url = new URL(es.url);
        expect(`${url.origin}${url.pathname}`, "proxy API").toBe(`${env.serve.replace(/\/$/, "")}${pathname}`);
        expect(Buffer.from(url.searchParams.get("u")!, "base64url").toString(), "target URL").toBe(target);
        expect(JSON.parse(Buffer.from(url.searchParams.get("h")!, "base64url").toString()), "headers").toEqual({ "x-siyuan-sdk-test": ["hello"] });
        expect(url.searchParams.get("t"), "timeout").toBe("500ms");
        expect(url.searchParams.get("token"), "API token").toBe(env.token);
        expect(es.withCredentials, "withCredentials").toBe(true);
    });

    it("normalize the target URL", () => {
        const es = client.esProxy("https://b\u00FCcher.example/a b", { EventSource: CaptureEventSource });
        const u = new URL(es.url).searchParams.get("u")!;
        expect(Buffer.from(u, "base64url").toString(), "target URL").toBe("https://xn--bcher-kva.example/a%20b");
        expect(() => client.esProxy("siyuan-sdk-test", { EventSource: CaptureEventSource }), "relative URL").toThrow(TypeError);
    });

    it("throw a TypeError when no EventSource implementation is available", () => {
        vi.stubGlobal("EventSource", undefined);
        onTestFinished(() => {
            vi.unstubAllGlobals();
        });
        expect(() => client.esProxy(`${upstream.url}/events`), "esProxy").toThrow(TypeError);
    });

    it.each([
        { title: "the target server responds with an error status", target: (): string => `${upstream.url}/none` },
        { title: "the target URL is not http/https", target: (): string => "ftp://127.0.0.1/" },
    ])("fail the connection when $title", async ({ target }) => {
        const es = client.esProxy(target(), { EventSource: FetchEventSource });
        onTestFinished(() => es.close());
        await expect(waitForError(es), "error event").resolves.toBeInstanceOf(Event);
        expect(es.readyState, "readyState").toBe(es.CLOSED);
    });
});
