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

/**
 * 正向代理测试使用的本地目标服务器
 * 服务器由测试进程启动，只监听 127.0.0.1 的随机端口；内核未启用安全模式时允许代理到本机地址
 */

import { createServer } from "node:http";

import Websocket from "isomorphic-ws";
import { afterAll, beforeAll } from "vitest";

import type { IncomingMessage, RequestListener, Server } from "node:http";
import type { AddressInfo } from "node:net";

type TWebSocket = InstanceType<typeof Websocket>;

export interface IUpstreamOptions {
    /* HTTP 请求处理函数 */
    http?: RequestListener;
    /* WebSocket 连接处理函数，设置后在同一端口上接受 WebSocket 连接 */
    webSocket?: (socket: TWebSocket, request: IncomingMessage) => void;
    /* 选择 WebSocket 子协议，返回 false 表示不选择 */
    handleProtocols?: (protocols: Set<string>, request: IncomingMessage) => false | string;
}

export interface IUpstreamFixture {
    /* 目标服务器的 HTTP 地址（不含末尾的斜杠），beforeAll 执行完成后可用 */
    url: string;
    /* 目标服务器的 WebSocket 地址（不含末尾的斜杠），beforeAll 执行完成后可用 */
    wsURL: string;
}

/**
 * 在当前作用域注册一个本地目标服务器：beforeAll 中启动，afterAll 中关闭所有连接并停止
 * @param options - 请求处理函数
 */
export function useUpstream(options: IUpstreamOptions): IUpstreamFixture {
    const fixture: IUpstreamFixture = { url: "", wsURL: "" };
    const context: { server?: Server; wss?: any } = {};

    beforeAll(async () => {
        const server = createServer(options.http ?? ((_request, response) => {
            response.writeHead(404).end();
        }));
        context.server = server;
        if (options.webSocket) {
            context.wss = new Websocket.WebSocketServer({ server, handleProtocols: options.handleProtocols });
            context.wss.on("connection", options.webSocket);
        }
        await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
        const { port } = server.address() as AddressInfo;
        fixture.url = `http://127.0.0.1:${port}`;
        fixture.wsURL = `ws://127.0.0.1:${port}`;
    });

    afterAll(async () => {
        if (context.wss) {
            for (const socket of context.wss.clients) {
                socket.terminate();
            }
            await new Promise<void>((resolve) => context.wss.close(() => resolve()));
        }
        const server = context.server;
        if (server?.listening) {
            server.closeAllConnections();
            await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
        }
    });

    return fixture;
}

/**
 * 获取一个当前无人监听的本地端口，用于测试内核无法连接目标服务器的情况
 */
export async function getClosedPort(): Promise<number> {
    const server = createServer();
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address() as AddressInfo;
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    return port;
}
