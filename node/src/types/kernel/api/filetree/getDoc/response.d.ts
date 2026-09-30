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

// #region content

/**
 * Get block HTML DOM and other information
 */
export interface IResponse {
    /**
     * status code
     */
    readonly code: number;
    readonly data: IData;
    /**
     * status message
     */
    readonly msg: string;
}

/**
 * Response information
 */
export interface IData {
    /**
     * Block count
     */
    readonly blockCount: number;
    /**
     * Notebook ID
     */
    readonly box: string;
    /**
     * HTML DOM string
     */
    readonly content: string;
    readonly docInfo?: IDocInfo;
    /**
     * End Of File
     */
    readonly eof: boolean;
    /**
     * Map from heading block IDs to heading numbers, an empty object when heading numbers are
     * disabled or there are no headings, `null` in some loading modes
     */
    readonly headingNumbers: { [key: string]: string } | null;
    /**
     * Block ID
     */
    readonly id: string;
    /**
     * is backlink detail?
     */
    readonly isBacklinkExpand: boolean;
    /**
     * is syncing?
     */
    readonly isSyncing: boolean;
    /**
     * Document keywords
     */
    readonly keywords: null | string[];
    /**
     * Load mode
     */
    readonly mode: number;
    /**
     * Logic parent block ID
     * if heading exists, it is heading block ID
     * else equal parentID
     */
    readonly parent2ID: string;
    /**
     * Parent block ID
     */
    readonly parentID: string;
    /**
     * Document path, which needs to start with / and separate levels with /
     * path here corresponds to the database path field
     */
    readonly path: string;
    /**
     * Whether the document requires a password in the publish service (`content` is replaced
     * when required)
     */
    readonly publishAccessRequired: boolean;
    /**
     * Request ID (Unix timestamp)
     */
    readonly reqId: null | number;
    /**
     * Document block ID
     */
    readonly rootID: string;
    /**
     * is dynamic loading?
     */
    readonly scroll: boolean;
    /**
     * Block type
     */
    readonly type: TBlockType;
}

/**
 * Document information
 */
export interface IDocInfo {
    /**
     * Attribute view reference list, `null` when the document is not bound to any database
     */
    readonly attrViews: IDocInfoAttrView[] | null;
    /**
     * Inline Attribute List (IAL) of the document block
     */
    readonly ial: { [key: string]: string };
    /**
     * Document icon
     */
    readonly icon: string;
    /**
     * Block ID
     */
    readonly id: string;
    /**
     * Document name
     */
    readonly name: string;
    /**
     * The number of references to the document
     */
    readonly refCount: number;
    /**
     * IDs of the blocks referencing the document
     */
    readonly refIDs: string[];
    /**
     * Document block ID
     */
    readonly rootID: string;
    /**
     * The number of sub-documents
     */
    readonly subFileCount: number;
}

/**
 * Attribute view
 */
export interface IDocInfoAttrView {
    /**
     * Attribute view ID
     */
    readonly id: string;
    /**
     * Attribute view name
     */
    readonly name: string;
}

/**
 * Block type
 */
export type TBlockType = "NodeAttributeView" | "NodeAudio" | "NodeBlockQueryEmbed" | "NodeBlockquote" | "NodeCodeBlock" | "NodeDocument" | "NodeHeading" | "NodeHTMLBlock" | "NodeIFrame" | "NodeList" | "NodeListItem" | "NodeMathBlock" | "NodeParagraph" | "NodeSuperBlock" | "NodeTable" | "NodeThematicBreak" | "NodeVideo" | "NodeWidget";

// #endregion content
