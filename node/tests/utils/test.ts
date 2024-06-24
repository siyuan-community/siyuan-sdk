/* eslint-disable no-console */
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

import { describe, expect, test } from "vitest";

import type { ValidateFunction } from "ajv";

import type { IResponse } from "~/src/types/kernel/kernel";

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

interface ITestKernelAPIOptions<P, R> {
    name: string;
    payload?: {
        data?: P;
        validate?: ValidateFunction;
        test?: (payload: P, options: ITestKernelAPIOptions<P, R>) => Promise<void> | void;
    };
    request: (payload?: P) => Promise<R>;
    catch?: (error: unknown, payload?: P, options?: ITestKernelAPIOptions<P, R>) => Promise<void> | void;
    response?: {
        validate?: ValidateFunction;
        test?: (response: R, payload?: P, options?: ITestKernelAPIOptions<P, R>) => Promise<void> | void;
    };
    debug?: boolean;
    [key: string]: any;
}
/**
 * 校验内核 API
 * @param options 测试配置项
 */
export async function testKernelAPI<P, R>(options: ITestKernelAPIOptions<P, R>) {
    describe.sequential(options.name, async () => {
        try {
            /* 测试请求体 */
            if (options.payload) {
                /* 其他测试 */
                await options.payload.test?.(options.payload.data!, options);

                if (options.debug) {
                    console.debug("payload:", options.payload.data);
                }

                if (options.payload.validate) {
                    /* 校验请求体 */
                    testPayload(options.payload.data, options.payload.validate);
                }
            }

            /* 测试请求过程 */
            let response: R;
            try {
                response = await options.request(options.payload?.data);
            }
            catch (error) {
                if (options.catch) {
                    if (options.debug) {
                        console.debug("error:", error);
                    }
                    await options.catch(error, options.payload?.data, options);
                    return;
                }
                else {
                    throw error;
                }
            }

            /* 测试响应体 */
            if (options.response) {
                if (options.debug) {
                    console.debug("response:", response);
                }

                if (options.response.validate) {
                    /* 校验响应体 */
                    testResponse(response as IResponse, options.response.validate);
                }

                /* 其他测试 */
                await options.response.test?.(response, options.payload?.data, options);
            }
        }
        catch (error) {
            if (options.debug) {
                console.error(error);
            }
            testThrowError(error);
        }
    });
}

/**
 * 校验请求体
 * @param payload 请求体对象
 * @param validate ajv 校验函数
 */
export function testPayload<T>(payload: T, validate: ValidateFunction) {
    test("payload verify", async () => {
        const valid = validate(payload);
        expect.soft(valid, `verify payload using JSON Schema`).toBeTruthy(); // 校验请求体
        if (!valid) {
            console.warn(validate.errors);
        }
    });
}

/**
 * 校验异步函数调用并返回函数返回值
 */
export async function testPromise<T>(
    // func: () => Promise<T>,
    promise: Promise<T>,
): Promise<T> {
    return new Promise<T>((resolve) => {
        // REF https://cn.vitest.dev/api/expect.html#resolves
        test("promise verify", async () => {
            await expect
                .soft(promise, `verify promise resolve`)
                .resolves
                .toSatisfy((value) => {
                    resolve(value as T);
                    return true;
                });
        });
    });
}

/**
 * 校验响应体
 * @param response 响应体对象
 * @param validate ajv 校验函数
 */
export function testResponse<T extends IResponse = IResponse>(response: T, validate: ValidateFunction) {
    test("response verify", () => {
        expect.soft(response.code, `verify response code`).toEqual(0); // 校验响应码

        const valid = validate(response);
        expect.soft(valid, `verify response using JSON Schema`).toBeTruthy(); // 校验响应体
        if (!valid) {
            console.warn(validate.errors);
        }
    });
}

/**
 * 测试抛出异常
 * @param error 异常对象
 */
export function testThrowError(error: unknown) {
    test(`\x1B[31;1m${(error as object).constructor.name}`, () => {
        expect(() => {
            throw error;
        }).not.toThrowError(); // 输出运行时错误
    });
}
