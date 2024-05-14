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
 * Full text search
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
     * Search results
     */
    blocks: IBlock[];
    /**
     * The number of blocks in the full search results
     */
    matchedBlockCount: number;
    /**
     * The number of documents in the full search results
     */
    matchedRootCount: number;
    /**
     * Current page number
     */
    pageCount: number;
}

/**
 * Search result item
 */
export interface IBlock {
    /**
     * Block alias
     */
    alias: string;
    /**
     * notebook ID
     */
    box: string;
    /**
     * Grouped search results
     */
    children: IBlock[] | null;
    /**
     * Block content
     */
    content: string;
    count:   number;
    /**
     * Creation time
     */
    created: string;
    defID:   string;
    defPath: string;
    depth:   number;
    /**
     * The first block content in the container block
     */
    fcontent: string;
    /**
     * Whether to fold
     */
    folded: boolean;
    /**
     * The readable path of the document where it is located
     */
    hPath: string;
    /**
     * Inline Attribute List (IAL) of block
     */
    ial: Ial;
    /**
     * Block ID
     */
    id: string;
    /**
     * Block Markdown content
     */
    markdown: string;
    /**
     * Block memo
     */
    memo: string;
    /**
     * Block name
     */
    name: string;
    /**
     * Parent block ID
     */
    parentID: string;
    /**
     * The path of the document where it is located
     */
    path: string;
    /**
     * The block ID list of the block reference (the current block is referenced by these blocks)
     */
    refs: string[] | null;
    /**
     * Block reference text
     */
    refText: string;
    /**
     * Flash card ID
     */
    riffCardID: string;
    /**
     * Flash card review count
     */
    riffCardReps: number;
    /**
     * Document block ID
     */
    rootID: string;
    /**
     * Block sort priority
     */
    sort: number;
    /**
     * Block subtype
     */
    subType: SubTypeEnum;
    /**
     * Block tags
     */
    tag: string;
    /**
     * Block type
     */
    type: TypeEnum;
    /**
     * Update time
     */
    updated: string;
}

/**
 * Inline Attribute List (IAL) of block
 */
export interface Ial {
    /**
     * document block ID
     */
    id: string;
    /**
     * document title
     */
    title?: string;
    /**
     * The last time the block was updated
     */
    updated: string;
    [property: string]: string;
}

export type SubTypeEnum = "" | "u" | "o" | "t" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type TypeEnum = "NodeDocument" | "NodeSuperBlock" | "NodeBlockquote" | "NodeHeading" | "NodeParagraph" | "NodeTable" | "NodeCodeBlock" | "NodeHTMLBlock" | "NodeThematicBreak" | "NodeAudio" | "NodeVideo" | "NodeIFrame" | "NodeWidget" | "NodeBlockQueryEmbed" | "NodeAttributeView" | "NodeList" | "NodeListItem";

//#endregion content
