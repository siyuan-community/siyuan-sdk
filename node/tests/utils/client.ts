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

import process from "node:process";

import { Client } from "@/client/Client";

import CONSTANTS from "~/tests/constants";

import "dotenv/config";

const client = new Client(
    {
        baseURL: process.env.VITE_SIYUAN_SERVE,
        token: process.env.VITE_SIYUAN_TOKEN,
    },
    "fetch",
);

const broadcast = client.broadcast({
    channel: CONSTANTS.BROADCAST_CHANNEL_NAME,
});

export default {
    Client,
    client,
    broadcast,
};
