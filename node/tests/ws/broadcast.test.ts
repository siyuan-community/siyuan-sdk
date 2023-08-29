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
import CONSTANTS from "~/tests/constants";

import client from "~/tests/utils/client";

const pathname = client.Client.ws.broadcast.pathname;

describe(pathname, async () => {

    const message = new Date().toString();

    test("test channel push and listen message", async () => {
        const ws = client.client.broadcast({
            channel: CONSTANTS.BROADCAST_CHANNEL_NAME,
        });
        await expect.soft(
            new Promise((resolve, rejects) => {
                const listener = (e: WebSocketEventMap["message"]) => {
                    client.broadcast.removeEventListener("message", listener);
                    resolve(e.data);
                }

                client.broadcast.addEventListener("message", listener);

                ws.addEventListener("error", rejects);
                ws.addEventListener("open", () => {
                    ws.send(message);
                });
            }),
            "listen message",
        ).resolves.toEqual(message);
        ws.close();
    });
});
