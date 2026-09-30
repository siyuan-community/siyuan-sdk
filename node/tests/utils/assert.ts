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

import { expect } from "vitest";

import { KernelError } from "@/errors/kernel";

import type { ValidateFunction } from "ajv/dist/2020";

import type { IResponse } from "@/types/kernel/kernel";

import type { IKernelAPIValidators } from "./schema";

/* 失败信息中最多列出的 JSON Schema 校验错误数量 */
const MAX_SCHEMA_ERRORS = 10;

/**
 * 格式化 JSON Schema 校验错误
 * @param validate - 已执行过校验的 ajv 校验函数
 */
export function formatSchemaErrors(validate: ValidateFunction): string {
    const errors = validate.errors ?? [];
    const lines = errors
        .slice(0, MAX_SCHEMA_ERRORS)
        .map((error) => `  ${error.instancePath || "/"}: ${error.message} ${JSON.stringify(error.params)}`);
    if (errors.length > MAX_SCHEMA_ERRORS) {
        lines.push(`  ... ${errors.length - MAX_SCHEMA_ERRORS} more error(s)`);
    }
    return lines.join("\n");
}

/**
 * 断言数据符合 JSON Schema，失败信息中列出不符合的字段
 * @param validate - ajv 校验函数
 * @param data - 待校验的数据
 * @param label - 数据名称
 * @param soft - 是否使用软断言（失败后继续执行后续断言）
 */
export function expectSchema(validate: ValidateFunction, data: unknown, label: string, soft: boolean = false): void {
    const valid = validate(data);
    const message = valid
        ? label
        : `${label} does not match the JSON Schema:\n${formatSchemaErrors(validate)}`;
    (soft ? expect.soft : expect)(valid, message).toBe(true);
}

/**
 * 断言请求体符合 JSON Schema
 * @param validators - 内核 API 的校验函数
 * @param payload - 请求体
 */
export function expectPayload(validators: IKernelAPIValidators, payload: unknown): void {
    if (validators.payload) {
        expectSchema(validators.payload, payload, "payload");
    }
}

/**
 * 断言内核 API 的响应体：响应码为 0，且符合 JSON Schema
 * 响应体的 JSON Schema 校验使用软断言，校验失败时仍会继续检查响应内容
 * @param validators - 内核 API 的校验函数
 * @param response - 响应体
 */
export function expectResponse(validators: IKernelAPIValidators, response: IResponse): void {
    expect(response.code, "response code").toBe(0);
    if (validators.response) {
        expectSchema(validators.response, response, "response", true);
    }
}

/**
 * 断言 Promise 被拒绝，且拒绝原因为指定响应码的内核异常
 * @param promise - 调用内核 API 返回的 Promise
 * @param code - 期望的内核响应码
 * @returns 内核异常
 */
export async function expectKernelError(promise: Promise<unknown>, code: number): Promise<KernelError> {
    const error = await promise.then(
        (value: unknown) => expect.unreachable(`expected a KernelError, but the request resolved with ${JSON.stringify(value)}`),
        (reason: unknown) => reason,
    );
    expect(error, "error type").toBeInstanceOf(KernelError);
    expect((error as KernelError).code, `kernel error code (${(error as KernelError).msg})`).toBe(code);
    return error as KernelError;
}
