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
 * Get child blocks
 */
export interface IResponse {
    /**
     * status code
     */
    code: number;
    data: IBlock[];
    /**
     * status message
     */
    msg: string;
}

/**
 * sub block list
 *
 * sub block
 */
export interface IBlock {
    /**
     * block ID
     */
    id: string;
    /**
     * block subtype
     */
    subType?: SubType;
    /**
     * block type
     */
    type: Type;
}

/**
 * block subtype
 */
export type SubType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "u" | "o" | "t";

/**
 * block type
 */
export type Type = "d" | "s" | "b" | "l" | "i" | "h" | "p" | "m" | "t" | "c" | "html" | "query_embed" | "tb" | "audio" | "video" | "iframe" | "widget";

//#endregion content
