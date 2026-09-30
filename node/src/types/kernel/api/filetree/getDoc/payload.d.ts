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
export interface IPayload {
    /**
     * The end block ID
     */
    readonly endID?: string;
    /**
     * Whether to highlight the matches of `query`
     */
    readonly highlight?: boolean;
    /**
     * Block ID
     */
    readonly id: string;
    /**
     * Whether to include the document information `docInfo` in the response
     */
    readonly includeDocInfo?: boolean;
    /**
     * Block index
     */
    readonly index?: number;
    /**
     * Whether it is a reverse link
     */
    readonly isBacklink?: boolean;
    /**
     * Load mode
     */
    readonly mode?: number;
    /**
     * ID of the encrypted notebook containing the document, required for documents in encrypted
     * notebooks
     */
    readonly notebook?: string;
    /**
     * Map from backlink context block IDs to the original referencing block IDs, only used when
     * `isBacklink` is `true`
     */
    readonly originalRefBlockIDs?: { [key: string]: string };
    /**
     * Query statements
     */
    readonly query?: string;
    /**
     * Query method
     */
    readonly queryMethod?: number;
    readonly querySubTypes?: IQuerySubTypes;
    readonly queryTypes?: IQueryTypes;
    /**
     * Request ID (Unix timestamp)
     */
    readonly reqId?: number;
    /**
     * Maximum number of loaded blocks
     */
    readonly size?: number;
    /**
     * The starting block ID
     */
    readonly startID?: string;
}

/**
 * Block subtype filter, all subtypes of a type match when none of its subtypes is `true`
 */
export interface IQuerySubTypes {
    readonly heading?: IQuerySubTypesHeading;
    readonly list?: IQuerySubTypesList;
    readonly listItem?: IQuerySubTypesList;
}

/**
 * Heading levels
 */
export interface IQuerySubTypesHeading {
    /**
     * Heading 1
     */
    readonly h1?: boolean;
    /**
     * Heading 2
     */
    readonly h2?: boolean;
    /**
     * Heading 3
     */
    readonly h3?: boolean;
    /**
     * Heading 4
     */
    readonly h4?: boolean;
    /**
     * Heading 5
     */
    readonly h5?: boolean;
    /**
     * Heading 6
     */
    readonly h6?: boolean;
}

/**
 * List types
 */
export interface IQuerySubTypesList {
    /**
     * Ordered list
     */
    readonly o?: boolean;
    /**
     * Task list
     */
    readonly t?: boolean;
    /**
     * Unordered list
     */
    readonly u?: boolean;
}

/**
 * Query the specified block type (block type filter)
 */
export interface IQueryTypes {
    /**
     * Audio block
     */
    readonly audioBlock?: boolean;
    /**
     * Quote block
     */
    readonly blockquote?: boolean;
    /**
     * Callout
     */
    readonly callout?: boolean;
    /**
     * Code block
     */
    readonly codeBlock?: boolean;
    /**
     * Custom block
     */
    readonly customBlock?: boolean;
    /**
     * Database block
     */
    readonly databaseBlock?: boolean;
    /**
     * Document block
     */
    readonly document?: boolean;
    /**
     * Embed block
     */
    readonly embedBlock?: boolean;
    /**
     * Heading block
     */
    readonly heading?: boolean;
    /**
     * HTML block
     */
    readonly htmlBlock?: boolean;
    /**
     * IFrame block
     */
    readonly iframeBlock?: boolean;
    /**
     * List block
     */
    readonly list?: boolean;
    /**
     * List item block
     */
    readonly listItem?: boolean;
    /**
     * Math formula block
     */
    readonly mathBlock?: boolean;
    /**
     * Mind map block
     */
    readonly mindmap?: boolean;
    /**
     * Mind map item block
     */
    readonly mindmapItem?: boolean;
    /**
     * Paragraph block
     */
    readonly paragraph?: boolean;
    /**
     * Super blok
     */
    readonly superBlock?: boolean;
    /**
     * Tab item block
     */
    readonly tabItem?: boolean;
    /**
     * Table block
     */
    readonly table?: boolean;
    /**
     * Tabbed block
     */
    readonly tabs?: boolean;
    /**
     * Video block
     */
    readonly videoBlock?: boolean;
    /**
     * Widget block
     */
    readonly widgetBlock?: boolean;
}

// #endregion content
