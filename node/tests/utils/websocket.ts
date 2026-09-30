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

import { afterAll, beforeAll, expect, vi } from "vitest";

import { client } from "./client";
import { INDEX_TIMEOUT, uniqueName } from "./fixtures";

type TWebSocket = ReturnType<typeof client.broadcast>;

export interface IBroadcastFixture {
    /* 广播频道名称，全局唯一 */
    readonly channel: string;
    /* 已连接到该频道的 WebSocket，beforeAll 执行完成后可用 */
    ws: TWebSocket;
}

/**
 * 在当前作用域注册一个广播频道连接
 * beforeAll 中建立连接，并等待内核登记该频道，afterAll 中关闭连接
 * @param label - 名称标签
 */
export function useBroadcast(label: string): IBroadcastFixture {
    const fixture = {
        channel: uniqueName(label),
        ws: undefined as unknown as TWebSocket,
    };

    beforeAll(async () => {
        fixture.ws = client.broadcast({ channel: fixture.channel });
        await new Promise<void>((resolve, reject) => {
            fixture.ws.addEventListener("open", () => resolve(), { once: true });
            fixture.ws.addEventListener("error", (event: { message: string }) => reject(new Error(`Cannot connect to broadcast channel ${fixture.channel}: ${event.message}`)), { once: true });
        });

        /* 客户端触发 open 事件时，内核可能还没有把连接登记到频道中 */
        await vi.waitFor(
            async () => {
                const response = await client.getChannelInfo({ name: fixture.channel });
                expect(response.data.channel.count, "channel subscribers").toBeGreaterThanOrEqual(1);
            },
            { timeout: INDEX_TIMEOUT, interval: 100 },
        );
    });

    afterAll(async () => {
        const ws = fixture.ws;
        if (ws && ws.readyState !== ws.CLOSED) {
            await new Promise<void>((resolve) => {
                ws.addEventListener("close", () => resolve(), { once: true });
                ws.close();
            });
        }
    });

    return fixture;
}

/**
 * 等待 WebSocket 收到满足条件的消息
 * @param ws - WebSocket 连接
 * @param predicate - 消息判断条件
 * @param timeout - 超时时间 (单位: ms)
 * @returns 消息内容
 */
export async function waitForMessage(
    ws: TWebSocket,
    predicate: (data: unknown) => boolean,
    timeout: number = INDEX_TIMEOUT,
): Promise<unknown> {
    return new Promise((resolve, reject) => {
        const state = { timer: undefined as ReturnType<typeof setTimeout> | undefined };
        const listener = (event: { data: unknown }): void => {
            if (predicate(event.data)) {
                clearTimeout(state.timer);
                ws.removeEventListener("message", listener);
                resolve(event.data);
            }
        };
        state.timer = setTimeout(() => {
            ws.removeEventListener("message", listener);
            reject(new Error(`No expected message received within ${timeout} ms`));
        }, timeout);
        ws.addEventListener("message", listener);
    });
}
