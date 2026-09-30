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
 * 读取快照中的文件需要工作空间已初始化数据仓库并创建过快照，而快照一旦创建便会留在工作空间中，
 * 因此这里只测试读取不存在的快照文件时内核返回的错误
 */

import { beforeAll, describe, it } from "vitest";

import { expectKernelError, expectPayload } from "~/tests/utils/assert";
import { client } from "~/tests/utils/client";
import { loadKernelAPISchemas } from "~/tests/utils/schema";

import { Client } from "@/client/Client";

import type { IKernelAPIValidators } from "~/tests/utils/schema";

import type openRepoSnapshotFile from "@/types/kernel/api/repo/openRepoSnapshotFile";

const pathname = Client.api.repo.openRepoSnapshotFile.pathname;

describe(pathname, () => {
    const context = {
        validators: {} as IKernelAPIValidators,
    };

    beforeAll(async () => {
        context.validators = await loadKernelAPISchemas(pathname);
    });

    it("non-existent file", async () => {
        const payload: openRepoSnapshotFile.IPayload = {
            id: "0000000000000000000000000000000000000000",
        };
        expectPayload(context.validators, payload);

        await expectKernelError(client.openRepoSnapshotFile(payload), -1);
    });
});
