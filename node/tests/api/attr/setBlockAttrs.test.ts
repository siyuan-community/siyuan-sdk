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

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import type setBlockAttrs from "@/types/kernel/api/attr/setBlockAttrs";

const pathname = client.Client.api.attr.setBlockAttrs.pathname;

interface ICase {
    name: string;
    before?: () => void;
    payload: setBlockAttrs.IPayload;
    after?: () => void;
    debug: boolean;
}

describe(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const cases: ICase[] = [
        /* 设置块属性测试 */
        {
            name: "set block attr",
            payload: {
                id: "20240608220844-2jfu489", // 测试/块属性测试
                attrs: {
                    "custom-test-set": "1",
                },
            },
            after: async () => {
                it("test the result of set attrs", async () => {
                    await expect(
                        client.client.getBlockAttrs({
                            id: "20240608220844-2jfu489",
                        }),
                    ).resolves.toMatchObject({
                        code: 0,
                        data: {
                            "custom-test-set": "1",
                        },
                    });
                });
            },
            debug: false,
        },
        /* 删除块属性测试 */
        {
            name: "delete block attr",
            before: async () => {
                await client.client.setBlockAttrs({
                    id: "20240608220844-2jfu489",
                    attrs: {
                        "custom-test-delete-empty": "1",
                        "custom-test-delete-null": "2",
                    },
                });
            },
            payload: {
                id: "20240608220844-2jfu489", // 测试/块属性测试
                attrs: {
                    "custom-test-delete-empty": "",
                    "custom-test-delete-null": null,
                },
            },
            after: async () => {
                // eslint-disable-next-line test/no-identical-title
                it("test the result of set attrs", async () => {
                    const response = await client.client.getBlockAttrs({
                        id: "20240608220844-2jfu489",
                    });
                    expect(response.data["custom-test-delete-empty"], `delete attr by set value to ""`).toBeUndefined();
                    expect(response.data["custom-test-delete-null"], `delete attr by set value to null`).toBeUndefined();
                });
            },
            debug: false,
        },
    ];

    cases.forEach((item) => {
        testKernelAPI<setBlockAttrs.IPayload, setBlockAttrs.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                validate: validate_payload,
                test: item.before,
            },
            request: payload => client.client.setBlockAttrs(payload!),
            response: {
                validate: validate_response,
                test: item.after,
            },
            debug: item.debug,
        });
    });
});
