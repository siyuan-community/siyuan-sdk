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
 * Get block HTML DOM and other information
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
     * Block count
     */
    blockCount: number;
    /**
     * Notebook ID
     */
    box: string;
    /**
     * HTML DOM string
     */
    content: string;
    /**
     * End Of File
     */
    eof: boolean;
    /**
     * Block ID
     */
    id: string;
    /**
     * is backlink detail?
     */
    isBacklinkExpand: boolean;
    /**
     * is syncing?
     */
    isSyncing: boolean;
    /**
     * Load mode
     */
    mode: number;
    /**
     * Logic parent block ID
     * if heading exists, it is heading block ID
     * else equal parentID
     */
    parent2ID: string;
    /**
     * Parent block ID
     */
    parentID: string;
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
     * is dynamic loading?
     */
    scroll: boolean;
    /**
     * Block type
     */
    type: Type;
}

/**
 * Block type
 */
export type Type = "NodeDocument" | "NodeSuperBlock" | "NodeBlockquote" | "NodeList" | "NodeListItem" | "NodeHeading" | "NodeParagraph" | "NodeMathBlock" | "NodeTable" | "NodeCodeBlock" | "NodeHTMLBlock" | "NodeThematicBreak" | "NodeAudio" | "NodeVideo" | "NodeIFrame" | "NodeWidget" | "NodeBlockQueryEmbed";
