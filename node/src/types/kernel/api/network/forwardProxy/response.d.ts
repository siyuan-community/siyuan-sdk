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
export interface IResponse {
    /**
     * status code
     */
    code: number;
    data: IData;
    /**
     * status message
     */
    msg: string;
}

/**
 * Response information
 */
export interface IData {
    /**
     * response body
     */
    body: string;
    /**
     * response body encoding schema
     */
    bodyEncoding: TEncodeSchema;
    /**
     * response content-type
     */
    contentType: string;
    /**
     * response elapsed
     */
    elapsed: number;
    /**
     * response headers
     */
    headers: { [key: string]: string[] };
    /**
     * HTTP status code
     */
    status: number;
    /**
     * URL to request
     */
    url: string;
}

/**
 * response body encoding schema
 */
export type TEncodeSchema = "text" | "base64" | "base64-std" | "base64-url" | "base32" | "base32-std" | "base32-hex" | "hex";

//#endregion content
