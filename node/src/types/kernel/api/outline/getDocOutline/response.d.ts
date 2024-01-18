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
 * Gets the document outline
 */
export interface IResponse {
    /**
     * status code
     */
    code: number;
    /**
     * Outline item list
     */
    data: IOutlineTopNode[];
    /**
     * status message
     */
    msg: string;
}

/**
 * Outline top node
 */
export interface IOutlineTopNode {
    /**
     * Outline Lover node list
     */
    blocks?: IOutlineLowerNode[];
    /**
     * Notebook ID
     */
    box: string;
    /**
     * Number of child nodes
     */
    count: number;
    /**
     * Outline depth
     */
    depth: number;
    /**
     * Block ID
     */
    id: string;
    /**
     * The HTML content of Heading block
     */
    name: string;
    /**
     * Block type
     */
    nodeType: NodeTypeEnum;
    /**
     * Block sub-type
     */
    subType: SubType;
    /**
     * Outline item type
     */
    type: PurpleType;
    [property: string]: any;
}

/**
 * Outline Lower node
 */
export interface IOutlineLowerNode {
    /**
     * Notebook ID
     */
    box: string;
    /**
     * Outline Lover node list
     */
    children: IOutlineLowerNode[] | null;
    /**
     * The HTML content of Heading block
     */
    content: string;
    /**
     * Number of child nodes
     */
    count: number;
    /**
     * Outline depth
     */
    depth: number;
    /**
     * Block ID
     */
    id: string;
    /**
     * Document path, which needs to start with / and separate levels with /
     * path here corresponds to the database path field
     */
    path: string;
    /**
     * Document block ID
     */
    rootID: string;
    /**
     * Block sub-type
     */
    subType: SubType;
    /**
     * Block type
     */
    type: NodeTypeEnum;
    [property: string]: any;
}

/**
 * Block sub-type
 */
export type SubType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * Block type
 */
export type NodeTypeEnum = "NodeHeading";

/**
 * Outline item type
 */
export type PurpleType = "outline";

//#endregion content
