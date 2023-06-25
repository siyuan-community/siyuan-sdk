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
    test,
    expect,
} from "vitest";
import { ValidateFunction } from "ajv";

import { IResponse } from "~/src/types/kernel";

/**
 * 添加额外的断言
 * REF https://cn.vitest.dev/api/expect.html#expect-extend
 * REF https://cn.vitest.dev/guide/extending-matchers.html
 */
expect.extend({
    toResolve: (received, expected: (received: any) => void) => {
        expected(received);
        return {
            pass: true,
            message: () => `resolved returned ${received}`,
        };
    },
});

/**
 * 校验内核 API
 * @param payload: 请求体对象
 * @param validate: ajv 校验函数
 */
export function testKernelAPI<T, U extends IResponse>(options: {
    name: string,
    payload?: {
        data: T,
        validate: ValidateFunction,
        test?: (payload: T) => void | Promise<void>,
    },
    request: (payload?: T) => Promise<U>,
    response?: {
        validate: ValidateFunction,
        test?: (response: U) => void | Promise<void>,
    },
    debug?: boolean,
}) {
    describe(options.name, async () => {
        try {
            /* 测试请求体 */
            if (options.payload) {
                if (options.debug) {
                    console.debug("payload:", options.payload.data);
                }

                /* 校验请求体 */
                testPayload(options.payload.data, options.payload.validate);

                /* 其他测试 */
                await options.payload.test?.(options.payload.data);
            }

            /* 测试请求过程 */
            const response = await options.request(options.payload?.data);

            /* 测试响应体 */
            if (options.response) {
                if (options.debug) {
                    console.debug("response:", response);
                }

                /* 校验响应体 */
                testResponse(response, options.response.validate);

                /* 其他测试 */
                await options.response.test?.(response);
            }
        } catch (error) {
            if (options.debug) {
                console.error(error);
            }
            testThrowError(error);
        }
    });
}

/**
 * 校验请求体
 * @param payload: 请求体对象
 * @param validate: ajv 校验函数
 */
export function testPayload<T>(
    payload: T,
    validate: ValidateFunction,
) {
    test("payload verify", async () => {
        expect.soft(
            validate(payload),
            `verify payload using JSON Schema`,
        ).toBeTruthy(); // 校验请求体
    });
}

/**
 * 校验异步函数调用并返回函数返回值
 */
export async function testPromise<T>(
    // func: () => Promise<T>,
    promise: Promise<T>,
): Promise<T> {
    return new Promise((resolve) => {
        // REF https://cn.vitest.dev/api/expect.html#resolves
        test("promise verify", async () => {
            await expect.soft(
                promise,
                `verify promise resolve`,
            ).resolves.toResolve(resolve);
        });
    });
}

/**
 * 校验响应体
 * @param payload: 响应体对象
 * @param validate: ajv 校验函数
 */
export function testResponse<T extends IResponse>(
    response: T,
    validate: ValidateFunction,
) {
    test("response verify", () => {
        expect.soft(
            response.code,
            `verify response code`,
        ).toEqual(0); // 校验响应码
        expect.soft(
            validate(response),
            `verify response using JSON Schema`,
        ).toBeTruthy(); // 校验响应体
    });
}

/**
 * 测试抛出异常
 * @param error: 异常对象
 */
export function testThrowError(error: unknown) {
    test(`\x1b[31;1m${(error as object).constructor.name}`, () => {
        expect(
            () => { throw error },
        ).not.toThrowError(); // 输出运行时错误
    });
}
