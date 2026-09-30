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

/* 测试所需的环境变量，从 node/.env 加载，说明见 node/.env.example */

import "dotenv/config";

import process from "node:process";

/**
 * 读取必填的环境变量
 * @param name - 环境变量名
 * @returns 环境变量值
 */
function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is not set, copy node/.env.example to node/.env and fill it in`);
    }
    return value;
}

export const env = {
    /* 思源内核服务地址 */
    get serve(): string {
        return required("VITE_SIYUAN_SERVE");
    },
    /* 思源 API token */
    get token(): string {
        return required("VITE_SIYUAN_TOKEN");
    },
    /* 允许测试读写的工作空间目录，必须与内核当前打开的工作空间一致 */
    get workspace(): string {
        return required("VITE_SIYUAN_WORKSPACE");
    },
};

export default env;
