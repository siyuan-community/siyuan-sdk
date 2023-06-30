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
export enum SubType {
    H1 = "h1",
    H2 = "h2",
    H3 = "h3",
    H4 = "h4",
    H5 = "h5",
    H6 = "h6",
    O = "o",
    T = "t",
    U = "u",
}

/**
 * block type
 */
export enum Type {
    Audio = "audio",
    B = "b",
    C = "c",
    D = "d",
    H = "h",
    HTML = "html",
    I = "i",
    Iframe = "iframe",
    L = "l",
    M = "m",
    P = "p",
    QueryEmbed = "query_embed",
    S = "s",
    T = "t",
    TB = "tb",
    Video = "video",
    Widget = "widget",
}
