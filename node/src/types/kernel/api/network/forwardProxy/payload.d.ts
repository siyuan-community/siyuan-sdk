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

//#region content
/**
 * Forward proxy
 */
export interface IPayload {
    /**
     * Content-Type for request body
     * @default: "application/json"
     */
    contentType?: string;
    /**
     * request headers list
     */
    headers: { [key: string]: string }[];
    /**
     * HTTP method to request
     * @default: "GET"
     */
    method?: TRequestMethod;
    /**
     * request body
     */
    payload?: Payload;
    /**
     * Encoding schema for request payload
     * @default: "text"
     */
    payloadEncoding?: TEncodeSchema;
    /**
     * Encoding schema for response body
     * @default: "text"
     */
    responseEncoding?: TEncodeSchema;
    /**
     * timeout to request (ms)
     * @default: 7000
     */
    timeout?: number;
    /**
     * URL to request
     */
    url: string;
}

/**
 * HTTP method to request
 * @default: "GET"
 */
export type TRequestMethod = "GET" | "HEAD" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "TRACE" | "CONNECT";

/**
 * request body
 */
export type Payload = { [key: string]: any } | string;

/**
 * Encoding schema for request payload
 * @default: "text"
 *
 * Encoding schema for response body
 * @default: "text"
 */
export type TEncodeSchema = "text" | "base64" | "base64-std" | "base64-url" | "base32" | "base32-std" | "base32-hex" | "hex";

//#endregion content
