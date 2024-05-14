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
 * Get document information
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
 * document information
 */
export interface IData {
    /**
     * Attribute view reference list
     */
    attrViews: IAttrView[];
    ial:       Ial;
    /**
     * document icon
     */
    icon: string;
    /**
     * block ID
     */
    id: string;
    /**
     * document name
     */
    name: string;
    /**
     * The number of references to the document
     */
    refCount: number;
    /**
     * ID of the block referencing the document
     */
    refIDs: string[];
    /**
     * document block ID
     */
    rootID: string;
    /**
     * The number of sub-documents
     */
    subFileCount: number;
}

/**
 * Attribute view
 */
export interface IAttrView {
    /**
     * Attribute view ID
     */
    id: string;
    /**
     * Attribute view name
     */
    name: ID;
}

export type ID = "Untitled" | "Sin título" | "Sans titre" | "未命名";

/**
 * Inline Attribute List (IAL) of document block
 */
export interface Ial {
    /**
     * document block ID
     */
    id: string;
    /**
     * document title
     */
    title: string;
    /**
     * The last time the block was updated
     */
    updated: string;
    [property: string]: string;
}

//#endregion content
