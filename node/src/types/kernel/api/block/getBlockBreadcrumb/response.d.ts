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
 * Get block breadcrumb
 */
export interface IResponse {
    /**
     * status code
     */
    code: number;
    /**
     * breadcrumb item list
     */
    data: IBreadcrumbItem[];
    /**
     * status message
     */
    msg: string;
}

export interface IBreadcrumbItem {
    /**
     * Block children
     */
    children: null;
    /**
     * Block ID
     */
    id: string;
    /**
     * Block text content
     */
    name: string;
    /**
     * Block subtype
     */
    subType: SubTypeEnum;
    /**
     * Block type
     */
    type: TypeEnum;
}

export type SubTypeEnum = "" | "u" | "o" | "t" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type TypeEnum = "NodeDocument" | "NodeSuperBlock" | "NodeBlockquote" | "NodeHeading" | "NodeParagraph" | "NodeTable" | "NodeCodeBlock" | "NodeHTMLBlock" | "NodeThematicBreak" | "NodeAudio" | "NodeVideo" | "NodeIFrame" | "NodeWidget" | "NodeBlockQueryEmbed" | "NodeAttributeView" | "NodeList" | "NodeListItem";

//#endregion content
