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

import { randomUUID } from "node:crypto";

import { describe, expect, it, onTestFinished } from "vitest";

import { client } from "~/tests/utils/client";
import { getClosedPort, useUpstream } from "~/tests/utils/upstream";

import { Client } from "@/client/Client";

import type { Buffer } from "node:buffer";
import type { IncomingMessage } from "node:http";

import type { IWebSocketProxyInit } from "@/client/Client";

type TWebSocket = ReturnType<typeof client.wsProxy>;

interface ICloseInfo {
    code: number;
    reason: string;
}

interface IConnection {
    /* 目标服务器收到的握手请求 */
    request: IncomingMessage;
    /* 目标服务器上的连接关闭时的状态码与原因 */
    closed: Promise<ICloseInfo>;
}

const pathname = Client.ws.network.proxy.pathname;

/* 目标服务器支持的子协议 */
const PROTOCOL = "siyuan-sdk-test";

/**
 * 等待 WebSocket 连接建立
 * @param ws - WebSocket 连接
 */
async function waitForOpen(ws: TWebSocket): Promise<void> {
    await new Promise<void>((resolve, reject) => {
        ws.addEventListener("open", () => resolve(), { once: true });
        ws.addEventListener("error", (event: { message: string }) => reject(new Error(event.message)), { once: true });
    });
}

/**
 * 等待 WebSocket 收到下一条消息
 * @param ws - WebSocket 连接
 * @returns 消息内容
 */
async function nextMessage(ws: TWebSocket): Promise<unknown> {
    return new Promise((resolve) => {
        ws.addEventListener("message", (event: { data: unknown }) => resolve(event.data), { once: true });
    });
}

/**
 * 等待 WebSocket 关闭
 * @param ws - WebSocket 连接
 * @returns 关闭时的状态码与原因
 */
async function waitForClose(ws: TWebSocket): Promise<ICloseInfo> {
    return new Promise((resolve) => {
        ws.addEventListener("close", (event: ICloseInfo) => resolve({ code: event.code, reason: event.reason }), { once: true });
    });
}

describe(pathname, () => {
    /* 目标服务器上的连接，键为握手请求的 URL */
    const connections = new Map<string, IConnection>();
    const upstream = useUpstream({
        webSocket: (socket, request) => {
            const closed = new Promise<ICloseInfo>((resolve) => {
                socket.on("close", (code: number, reason: Buffer) => resolve({ code, reason: reason.toString() }));
            });
            connections.set(request.url!, { request, closed });

            /* 原样返回收到的消息，收到文本消息 close 时以状态码 4000 关闭连接 */
            socket.on("message", (data: Buffer, isBinary: boolean) => {
                if (!isBinary && data.toString() === "close") {
                    socket.close(4000, "bye");
                }
                else {
                    socket.send(data, { binary: isBinary });
                }
            });
        },
        handleProtocols: (protocols) => (protocols.has(PROTOCOL) ? PROTOCOL : false),
    });

    /**
     * 通过代理连接到目标服务器上的唯一路径，测试结束时关闭连接
     * @param search - 目标地址的查询参数
     * @param init - 连接选项
     */
    function connect(search: string = "", init?: IWebSocketProxyInit): { ws: TWebSocket; url: string } {
        const url = `/${randomUUID()}${search}`;
        const ws = client.wsProxy(`${upstream.wsURL}${url}`, init);
        onTestFinished(() => ws.close());
        return { ws, url };
    }

    it("relay text and binary messages", async () => {
        const { ws } = connect();
        ws.binaryType = "arraybuffer";
        await waitForOpen(ws);

        const text = nextMessage(ws);
        ws.send("hello");
        await expect(text, "text message").resolves.toBe("hello");

        const binary = nextMessage(ws);
        ws.send(new Uint8Array([0, 1, 2, 255]));
        expect(new Uint8Array(await binary as ArrayBuffer), "binary message").toEqual(new Uint8Array([0, 1, 2, 255]));
    });

    it("send the handshake headers and subprotocols to the target server", async () => {
        const { ws, url } = connect("?foo=bar", {
            headers: { "User-Agent": "siyuan-sdk-test", "X-SiYuan-SDK-Test": "hello" },
            protocols: [PROTOCOL, "other"],
        });
        /* 内核的握手响应中带有目标服务器的握手响应头 */
        const upgrade = new Promise<IncomingMessage>((resolve) => ws.once("upgrade", resolve));
        await waitForOpen(ws);

        const { request } = connections.get(url)!;
        expect(request.headers["user-agent"], "header User-Agent").toBe("siyuan-sdk-test");
        expect(request.headers["x-siyuan-sdk-test"], "header X-SiYuan-SDK-Test").toBe("hello");
        expect(request.headers["sec-websocket-protocol"], "header Sec-WebSocket-Protocol").toBe(`${PROTOCOL}, other`);
        expect(request.headers, "API token is not forwarded").not.toHaveProperty("authorization");
        expect((await upgrade).headers["siyuan-proxy-sec-websocket-protocol"], "subprotocol selected by the target server").toBe(PROTOCOL);
        expect(ws.protocol, "no subprotocol is negotiated with the kernel").toBe("");
    });

    it("relay the close frame from the target server", async () => {
        const { ws } = connect();
        await waitForOpen(ws);

        const closed = waitForClose(ws);
        ws.send("close");
        await expect(closed, "close status").resolves.toEqual({ code: 4000, reason: "bye" });
    });

    it("relay the close frame to the target server", async () => {
        const { ws, url } = connect();
        await waitForOpen(ws);

        ws.close(4001, "client bye");
        await expect(connections.get(url)!.closed, "close status").resolves.toEqual({ code: 4001, reason: "client bye" });
    });

    it("throw a TypeError for invalid target URLs", () => {
        expect(() => client.wsProxy("siyuan-sdk-test"), "relative URL").toThrow(TypeError);
    });

    it("fail to connect to target URLs that are not ws/wss", async () => {
        const ws = client.wsProxy(`${upstream.url}/`);
        await expect(waitForOpen(ws), "handshake is rejected").rejects.toThrow("Unexpected server response: 400");
    });

    it("fail to connect when the target server is unreachable", async () => {
        const port = await getClosedPort();
        const ws = client.wsProxy(`ws://127.0.0.1:${port}/`);
        await expect(waitForOpen(ws), "handshake is rejected").rejects.toThrow("Unexpected server response: 502");
    });
});
