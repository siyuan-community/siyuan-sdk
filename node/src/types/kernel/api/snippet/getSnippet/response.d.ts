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
 * Get code snippet list
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
 * response data
 */
export interface IData {
    snippets: ISnippet[];
}

/**
 * code snippet
 */
export interface ISnippet {
    /**
     * snippet content
     */
    content: string;
    /**
     * snippet enable status
     */
    enabled: boolean;
    /**
     * snippet ID
     */
    id: string;
    /**
     * snippet memo
     */
    memo: string;
    /**
     * snippet name
     */
    name: string;
    /**
     * snippet type
     */
    type: Type;
}

/**
 * snippet type
 */
export type Type = "js" | "css";

//#endregion content
