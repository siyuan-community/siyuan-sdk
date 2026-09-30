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

import { describe, expect, it } from "vitest";

import { client } from "~/tests/utils/client";
import { useBroadcast, waitForMessage } from "~/tests/utils/websocket";

import { Client } from "@/client/Client";

const pathname = Client.ws.broadcast.pathname;

describe(pathname, () => {
    const broadcast = useBroadcast("ws-broadcast");

    it("test channel push and listen message", async () => {
        const message = randomUUID();
        const received = waitForMessage(broadcast.ws, (data) => data === message);

        await client.postMessage({
            channel: broadcast.channel,
            message,
        });

        await expect(received, "listen message").resolves.toBe(message);
    });
});
