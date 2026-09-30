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

import { beforeAll, describe, expect, it } from "vitest";

import { expectPayload, expectResponse } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import { loadKernelAPISchemas } from "~/tests/utils/schema";
import { useBroadcast } from "~/tests/utils/websocket";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type getChannelInfo from "@/types/kernel/api/broadcast/getChannelInfo";

const pathname = Client.api.broadcast.getChannelInfo.pathname;

describe(pathname, () => {
    const broadcast = useBroadcast("getChannelInfo");
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
    });

    it("main", async () => {
        const payload: getChannelInfo.IPayload = { name: broadcast.channel };
        expectPayload(context.validators, payload);

        const response = await client.getChannelInfo(payload);
        expectResponse(context.validators, response);
        expect.soft(response.data.channel.name, "channel name").toBe(broadcast.channel);
        expect.soft(response.data.channel.count, "channel count").toBe(1);
    });
});
