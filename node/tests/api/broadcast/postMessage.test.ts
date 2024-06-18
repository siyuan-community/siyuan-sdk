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

import { describe, expect, it } from "vitest";

import CONSTANTS from "~/tests/constants";
import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import type postMessage from "@/types/kernel/api/broadcast/postMessage";

const pathname = client.Client.api.broadcast.postMessage.pathname;

describe(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const message = new Date().toString();

    testKernelAPI<postMessage.IPayload, postMessage.IResponse>({
        name: "main",
        payload: {
            data: {
                channel: CONSTANTS.BROADCAST_CHANNEL_NAME_MESSAGE,
                message,
            },
            validate: validate_payload,
            test: (payload, options) => {
                options.promise = new Promise((resolve: (msg: string) => void) => {
                    const listener = (e: WebSocketEventMap["message"]) => {
                        if (e.data === message) {
                            client.broadcast.removeEventListener("message", listener);
                            resolve(e.data);
                        }
                    };
                    client.broadcast.addEventListener("message", listener);
                });
            },
        },
        request: payload => client.client.postMessage(payload!),
        response: {
            validate: validate_response,
            test: (response, payload, options) => {
                it("test channel message", async () => {
                    await expect.soft(options.promise, "listen message").resolves.toEqual(message);
                });

                it("test channel info", () => {
                    expect.soft(response.data.channel.name, "channel name").toEqual(CONSTANTS.BROADCAST_CHANNEL_NAME);

                    expect.soft(response.data.channel.count, "channel count").toBeGreaterThanOrEqual(1);
                });
            },
        },
    });
});
