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
 * 全局 setup/teardown
 * - 运行前确认内核可以访问，且内核打开的工作空间就是 VITE_SIYUAN_WORKSPACE 指定的测试工作空间，
 *   避免测试误改日常使用的工作空间
 * - 运行前清理上次异常退出时遗留的测试夹具
 * - 运行后再次清理，若仍有遗留则报错，说明有测试没有清理自己创建的数据
 */

import { resolve } from "node:path";

import { sweepFixtures } from "~/tests/utils/cleanup";
import { client } from "~/tests/utils/client";
import { env } from "~/tests/utils/env";

interface IWorkspaceInfo {
    code: number;
    msg: string;
    data: {
        workspaceDir: string;
        siyuanVer: string;
    };
}

export async function setup(): Promise<void> {
    let workspace: string;
    try {
        /* SDK 尚未封装该 API */
        const response = await client._request<IWorkspaceInfo, object>("/api/system/getWorkspaceInfo", "POST", {});
        workspace = response.data.workspaceDir;
    }
    catch (error) {
        throw new Error(`Cannot access the SiYuan kernel at ${env.serve}`, { cause: error });
    }

    if (resolve(workspace) !== resolve(env.workspace)) {
        throw new Error(`The kernel at ${env.serve} serves the workspace ${workspace}, but VITE_SIYUAN_WORKSPACE is ${env.workspace}. Tests create and remove data, so they only run against the configured test workspace.`);
    }

    const leftovers = await sweepFixtures();
    if (leftovers.length > 0) {
        console.warn(`Removed test fixtures left by a previous run: ${leftovers.join("; ")}`);
    }
}

export async function teardown(): Promise<void> {
    const leaked = await sweepFixtures();
    if (leaked.length > 0) {
        throw new Error(`Some tests did not clean up their fixtures (removed now): ${leaked.join("; ")}`);
    }
}
