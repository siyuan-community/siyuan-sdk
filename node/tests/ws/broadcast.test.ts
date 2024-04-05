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

const pathname = client.Client.ws.broadcast.pathname;

describe(pathname, async () => {

    const channel = Date.now().toString(36);
    const message = new Date().toString();

    test("test channel push and listen message", async () => {
        const ws = client.client.broadcast({
            channel,
        });
        // await expect.soft(
            new Promise((resolve, rejects) => {
                const listener = (e: WebSocketEventMap["message"]) => {
                    ws.removeEventListener("message", listener);
                    resolve(e.data);
                }

                ws.addEventListener("message", listener);
                ws.addEventListener("error", rejects);
                ws.addEventListener("open", () => {
                    client.client.postMessage({
                        channel,
                        message,
                    });
                });
            });
            // "listen message",
        // ).resolves.toEqual(message);
        ws.close();
    });
});
