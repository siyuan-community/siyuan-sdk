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

import { describe, expect, it } from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import type currentTime from "@/types/kernel/api/system/currentTime";

const pathname = client.Client.api.system.currentTime.pathname;

describe.concurrent(pathname, async () => {
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_response.loadSchemaFile();
    const validate_response = schema_response.constructValidateFuction();

    testKernelAPI<never, currentTime.IResponse>({
        name: "main",
        request: () => client.client.currentTime(),
        response: {
            validate: validate_response,
            test: (response) => {
                /* 测试系统时钟误差 */
                it(`system time error test`, async () => {
                    const threshold = 10_000; // 时钟误差阈值 (单位: ms)
                    expect(response.data - Date.now(), `time error in threshold (${threshold} ms)`).within(-threshold, threshold, `threshold: ± ${threshold} ms`);
                });
            },
        },
    });
});
