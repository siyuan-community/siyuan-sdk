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

import { KernelError } from "~/src";
import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import readDir from "@/types/kernel/api/file/readDir";

const pathname = client.Client.api.file.readDir.pathname;

interface ICase {
    path: string,
    catch?: (
        error: unknown,
        payload: readDir.IPayload,
    ) => void,
    debug: boolean,
}

describe.concurrent(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const cases: ICase[] = [
        /* 工作空间目录 */
        { path: "", debug: false },
        { path: "/", debug: false },
        { path: ".", debug: false },
        { path: "./", debug: false },
        { path: "./.", debug: false },
        { path: "././", debug: false },

        /* 工作空间/data 目录 */
        { path: "data", debug: false },
        { path: "data/", debug: false },
        { path: "/data", debug: false },
        { path: "/data/", debug: false },
        { path: "./data", debug: false },
        { path: "./data/", debug: false },
        { path: "./data/.", debug: false },
        { path: "./data/./", debug: false },

        /* 工作空间外目录 */
        ...[
            { path: "..", debug: false },
            { path: "../", debug: false },
            { path: "/..", debug: false },
            { path: "/../", debug: false },
            { path: "./..", debug: false },
            { path: "./../", debug: false },
            { path: "./../.", debug: false },
            { path: "./.././", debug: false },
        ].map((item: ICase) => {
            item.catch = (error) => {
                test("KernelError: 403", () => {
                    expect(
                        error,
                        "test error's type",
                    ).toBeInstanceOf(KernelError);
                    expect(
                        (error as KernelError).code,
                        "test error's code",
                    ).toEqual(403);
                });
            };
            return item;
        }),

        /* 不存在目录 */
        ...[
            { path: "123", debug: false },
            { path: "456", debug: false },
            { path: "789", debug: false },
        ].map((item: ICase) => {
            item.catch = (error) => {
                test("KernelError: 404", () => {
                    expect(
                        error,
                        "test error's type",
                    ).toBeInstanceOf(KernelError);
                    expect(
                        (error as KernelError).code,
                        "test error's code",
                    ).toEqual(404);
                });
            };
            return item;
        }),

        /* 文件 */
        ...[
            { path: "conf/appearance/langs/en_US.json", debug: false },
            { path: "conf/appearance/langs/es_ES.json", debug: false },
            { path: "conf/appearance/langs/fr_FR.json", debug: false },
            { path: "conf/appearance/langs/zh_CN.json", debug: false },
            { path: "conf/appearance/langs/zh_CHT.json", debug: false },
        ].map((item: ICase) => {
            item.catch = (error) => {
                test("KernelError: 405", () => {
                    expect(
                        error,
                        "test error's type",
                    ).toBeInstanceOf(KernelError);
                    expect(
                        (error as KernelError).code,
                        "test error's code",
                    ).toEqual(405);
                });
            };
            return item;
        }),
    ];
    cases.forEach(item => {
        testKernelAPI<readDir.IPayload, readDir.IResponse>({
            name: "main",
            payload: {
                data: {
                    path: item.path, // 数据
                },
                validate: validate_payload,
            },
            request: (payload) => client.client.readDir(payload!),
            catch: item.catch,
            response: {
                validate: validate_response,
            },
            debug: item.debug,
        });
    });
});
