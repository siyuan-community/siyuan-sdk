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
export interface IPayload {
    /**
     * Search results grouping scheme
     * - `0`: No grouping (default)
     * - `1`: Group by document
     * @defaultValue 0
     */
    readonly groupBy?: number;
    /**
     * Search scheme
     * - `0`: Keyword (default)
     * - `1`: Query syntax
     * - `2`: SQL
     * - `3`: Regular expression
     * @defaultValue 0
     */
    readonly method?: number;
    /**
     * ID of the encrypted notebook to search, required for encrypted notebooks (use `paths` to
     * limit the range to normal notebooks)
     */
    readonly notebook?: string;
    /**
     * Search result sorting scheme
     * - `0`: Block type (default)
     * - `1`: Ascending by creation time
     * - `2`: Descending by creation time
     * - `3`: Ascending by update time
     * - `4`: Descending by update time
     * - `5`: By content order (only valid when grouping by document)
     * - `6`: Ascending by relevance
     * - `7`: Descending by relevance
     * @defaultValue 0
     */
    readonly orderBy?: number;
    /**
     * Current page number
     * Starts from `1`
     * @defaultValue 1
     */
    readonly page?: number;
    /**
     * Number of search results per page
     * minimum: 32
     * @defaultValue 32
     */
    readonly pageSize?: number;
    /**
     * Search range (document path list)
     * @defaultValue []
     */
    readonly paths?: string[];
    /**
     * Query statement
     */
    readonly query?: string;
    /**
     * Whether keyword search also matches document paths
     * @defaultValue true
     */
    readonly searchHPath?: boolean;
    readonly subTypes?: ISubTypes;
    /**
     * The type of block that the search results contain
     */
    readonly types?: ITypes;
}

/**
 * Block subtype filter, all subtypes of a type match when none of its subtypes is `true`
 */
export interface ISubTypes {
    readonly heading?: ISubTypesHeading;
    readonly list?: ISubTypesList;
    readonly listItem?: ISubTypesList;
}

/**
 * Heading levels
 */
export interface ISubTypesHeading {
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
export interface ISubTypesList {
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
 * The type of block that the search results contain
 *
 * Block type filter
 */
export interface ITypes {
    /**
     * Search results contain audio blocks
     * @defaultValue false
     */
    readonly audioBlock?: boolean;
    /**
     * Search results contain blockquote blocks
     * @defaultValue false
     */
    readonly blockquote?: boolean;
    /**
     * Search results contain callouts
     * @defaultValue false
     */
    readonly callout?: boolean;
    /**
     * Search results contain code blocks
     * @defaultValue false
     */
    readonly codeBlock?: boolean;
    /**
     * Search results contain custom blocks
     * @defaultValue false
     */
    readonly customBlock?: boolean;
    /**
     * Search results contain database blocks
     * @defaultValue false
     */
    readonly databaseBlock?: boolean;
    /**
     * Search results contain document blocks
     * @defaultValue false
     */
    readonly document?: boolean;
    /**
     * Search results contain embed blocks
     * @defaultValue false
     */
    readonly embedBlock?: boolean;
    /**
     * Search results contain heading blocks
     * @defaultValue false
     */
    readonly heading?: boolean;
    /**
     * Search results contain html blocks
     * @defaultValue false
     */
    readonly htmlBlock?: boolean;
    /**
     * Search results contain IFrame blocks
     * @defaultValue false
     */
    readonly iframeBlock?: boolean;
    /**
     * Search results contain list blocks
     * @defaultValue false
     */
    readonly list?: boolean;
    /**
     * Search results contain list item blocks
     * @defaultValue false
     */
    readonly listItem?: boolean;
    /**
     * Search results contain math blocks
     * @defaultValue false
     */
    readonly mathBlock?: boolean;
    /**
     * Search results contain mind map blocks
     * @defaultValue false
     */
    readonly mindmap?: boolean;
    /**
     * Search results contain mind map item blocks
     * @defaultValue false
     */
    readonly mindmapItem?: boolean;
    /**
     * Search results contain paragraph blocks
     * @defaultValue false
     */
    readonly paragraph?: boolean;
    /**
     * Search results contain super blocks
     * @defaultValue false
     */
    readonly superBlock?: boolean;
    /**
     * Search results contain tab item blocks
     * @defaultValue false
     */
    readonly tabItem?: boolean;
    /**
     * Search results contain table blocks
     * @defaultValue false
     */
    readonly table?: boolean;
    /**
     * Search results contain tabbed blocks
     * @defaultValue false
     */
    readonly tabs?: boolean;
    /**
     * Search results contain video blocks
     * @defaultValue false
     */
    readonly videoBlock?: boolean;
    /**
     * Search results contain widget blocks
     * @defaultValue false
     */
    readonly widgetBlock?: boolean;
}

// #endregion content
