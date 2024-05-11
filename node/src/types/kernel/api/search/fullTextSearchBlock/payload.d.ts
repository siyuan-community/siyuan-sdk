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
export interface IPayload {
    /**
     * Search results grouping scheme
     * - `0`: No grouping (default)
     * - `1`: Group by document
     * @default 0
     */
    groupBy?: number;
    /**
     * Search scheme
     * - `0`: Keyword (default)
     * - `1`: Query syntax
     * - `2`: SQL
     * - `3`: Regular expression
     * @default 0
     */
    method?: number;
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
     * @default 0
     */
    orderBy?: number;
    /**
     * Current page number
     * Starts from `1`
     * @default 1
     */
    page?: number;
    /**
     * Number of search results per page
     * minimum: 32
     * @default 32
     */
    pageSize?: number;
    /**
     * Search range (document path list)
     * @default []
     */
    paths?: string[];
    /**
     * Query statement
     */
    query?: string;
    /**
     * The type of block that the search results contain
     */
    types?: ITypes;
}

/**
 * The type of block that the search results contain
 *
 * Block type filter
 */
export interface ITypes {
    /**
     * Search results contain blockquote blocks
     * @default false
     */
    blockquote?: boolean;
    /**
     * Search results contain code blocks
     * @default false
     */
    codeBlock?: boolean;
    /**
     * Search results contain database blocks
     * @default false
     */
    databaseBlock?: boolean;
    /**
     * Search results contain document blocks
     * @default false
     */
    document?: boolean;
    /**
     * Search results contain embed blocks
     * @default false
     */
    embedBlock?: boolean;
    /**
     * Search results contain heading blocks
     * @default false
     */
    heading?: boolean;
    /**
     * Search results contain html blocks
     * @default false
     */
    htmlBlock?: boolean;
    /**
     * Search results contain list blocks
     * @default false
     */
    list?: boolean;
    /**
     * Search results contain list item blocks
     * @default false
     */
    listItem?: boolean;
    /**
     * Search results contain math blocks
     * @default false
     */
    mathBlock?: boolean;
    /**
     * Search results contain paragraph blocks
     * @default false
     */
    paragraph?: boolean;
    /**
     * Search results contain super blocks
     * @default false
     */
    superBlock?: boolean;
    /**
     * Search results contain table blocks
     * @default false
     */
    table?: boolean;
}

//#endregion content
