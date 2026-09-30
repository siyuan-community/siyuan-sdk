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
 * Full text search
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
     * Search results
     */
    readonly blocks: IBlock[];
    /**
     * Whether it is the current document content search mode
     */
    readonly docMode: boolean;
    /**
     * The number of blocks in the full search results
     */
    readonly matchedBlockCount: number;
    /**
     * The number of documents in the full search results
     */
    readonly matchedRootCount: number;
    /**
     * Current page number
     */
    readonly pageCount: number;
}

/**
 * Search result item
 */
export interface IBlock {
    /**
     * Block alias
     */
    readonly alias: string;
    /**
     * notebook ID
     */
    readonly box: string;
    /**
     * Grouped search results
     */
    readonly children: IBlock[] | null;
    /**
     * Block content
     */
    readonly content: string;
    readonly count: number;
    /**
     * Creation time
     */
    readonly created: string;
    readonly defID: string;
    readonly defPath: string;
    readonly depth: number;
    /**
     * The first block content in the container block
     */
    readonly fcontent: string;
    /**
     * Whether to fold
     */
    readonly folded: boolean;
    /**
     * The readable path of the document where it is located
     */
    readonly hPath: string;
    /**
     * Inline Attribute List (IAL) of block
     */
    readonly ial: Ial;
    /**
     * Block ID
     */
    readonly id: string;
    /**
     * Block Markdown content
     */
    readonly markdown: string;
    /**
     * Block memo
     */
    readonly memo: string;
    /**
     * Block name
     */
    readonly name: string;
    /**
     * Heading number, not returned by this API
     */
    readonly number?: string;
    /**
     * Parent block ID, an empty string for document blocks
     */
    readonly parentID: string;
    /**
     * The path of the document where it is located
     */
    readonly path: string;
    /**
     * Number of references to the block (only set on child blocks when grouped by document)
     */
    readonly refCount: number;
    /**
     * Blocks referencing the current block, always `null` in this API
     */
    readonly refs: IBlock[] | null;
    /**
     * Block reference text
     */
    readonly refText: string;
    /**
     * Review state of the flashcard, always `null` in this API
     */
    readonly riffCard: IRiffCard | null;
    /**
     * Flash card ID
     */
    readonly riffCardID: string;
    /**
     * Document block ID
     */
    readonly rootID: string;
    /**
     * Block sort priority
     * - `0`: Document block
     * - `5`: Heading block
     * - `10`: Paragraph, code, math, table and HTML blocks
     * - `20`: List, list item, blockquote and callout blocks
     * - `30`: Super block and database block
     * - `100`: Other blocks
     */
    readonly sort: number;
    /**
     * Block subtype
     */
    readonly subType: SubTypeEnum;
    /**
     * Block tags
     */
    readonly tag: string;
    /**
     * Block type
     */
    readonly type: TypeEnum;
    /**
     * Update time
     */
    readonly updated: string;
}

/**
 * Inline Attribute List (IAL) of block
 */
export interface Ial {
    /**
     * document block ID
     */
    readonly id: string;
    /**
     * document title
     */
    readonly title?: string;
    /**
     * The last time the block was updated
     */
    readonly updated: string;
    [property: string]: string;
}

/**
 * Review state of a flashcard
 */
export interface IRiffCard {
    /**
     * Due time (RFC 3339)
     */
    readonly due: string;
    /**
     * Number of lapses
     */
    readonly lapses: number;
    /**
     * Last review time (RFC 3339)
     */
    readonly lastReview: string;
    /**
     * Number of reviews
     */
    readonly reps: number;
    /**
     * Card state
     * - `0`: New
     * - `1`: Learning
     * - `2`: Review
     * - `3`: Relearning
     */
    readonly state: number;
}

export type SubTypeEnum = "" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "o" | "t" | "u";

export type TypeEnum = "NodeAttributeView" | "NodeAudio" | "NodeBlockQueryEmbed" | "NodeBlockquote" | "NodeCodeBlock" | "NodeDocument" | "NodeHeading" | "NodeHTMLBlock" | "NodeIFrame" | "NodeList" | "NodeListItem" | "NodeParagraph" | "NodeSuperBlock" | "NodeTable" | "NodeThematicBreak" | "NodeVideo" | "NodeWidget";

// #endregion content
