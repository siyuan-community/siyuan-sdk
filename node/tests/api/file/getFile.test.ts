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
    expect,
    test,
} from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import getFile from "@/types/kernel/api/file/getFile";

const pathname = client.Client.api.file.getFile.pathname;

interface ICase {
    path: string,
    type: string,
    debug: boolean,
}

describe.concurrent(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();

    const cases: ICase[] = [
        {
            path: "/conf/appearance/boot/icon.png", // 二进制文件
            type: "string",
            debug: false,
        },
        {
            path: "/data/.siyuan/conf.json", // json 文件
            type: "object",
            debug: false,
        },
        {
            path: "/temp/siyuan.log", // 纯文本文件
            type: "string",
            debug: false,
        },
        {
            path: "/temp", // 目录
            type: "object", // 返回 { code: 405, msg: 'file is a directory', data: null }
            debug: false,
        },
    ];

    cases.forEach(item => {
        testKernelAPI<getFile.IPayload, unknown>({
            name: "main",
            payload: {
                data: {
                    path: item.path, // 数据
                },
                validate: validate_payload,
            },
            request: (payload) => client.client.getFile(payload!),
            response: {
                test: body => {
                    if (item.debug) {
                        console.debug(body);
                    }
                    test("response body type verify", () => {
                        expect(typeof body).toEqual(item.type);
                    });
                },
            },
            debug: item.debug,
        });
    });
});
