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

import { expectResponse } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import { loadKernelAPISchemas } from "~/tests/utils/schema";
import { useBroadcast } from "~/tests/utils/websocket";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

const pathname = Client.api.broadcast.getChannels.pathname;

describe(pathname, () => {
    const broadcast = useBroadcast("getChannels");
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
    });

    it("main", async () => {
        const response = await client.getChannels();
        expectResponse(context.validators, response);
        expect(response.data.channels).toContainEqual({ name: broadcast.channel, count: 1 });
    });
});
