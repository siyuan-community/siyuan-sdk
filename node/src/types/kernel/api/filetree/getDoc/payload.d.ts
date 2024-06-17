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
 * along with this program.  If not, see {@link http://www.gnu.org/licenses/}.
 */

//#region content
/**
 * Get block HTML DOM and other information
 */
export interface IPayload {
    /**
     * The end block ID
     */
    endID?: string;
    /**
     * Block ID
     */
    id: string;
    /**
     * Block index
     */
    index?: number;
    /**
     * Whether it is a reverse link
     */
    isBacklink?: boolean;
    /**
     * Load mode
     */
    mode?: number;
    /**
     * Query statements
     */
    query?: string;
    /**
     * Query method
     */
    queryMethod?: number;
    queryTypes?: IQueryTypes;
    /**
     * Maximum number of loaded blocks
     */
    size?: number;
    /**
     * The starting block ID
     */
    startID?: string;
}

/**
 * Query the specified block type (block type filter)
 */
export interface IQueryTypes {
    /**
     * Quote block
     */
    blockquote?: boolean;
    /**
     * Code block
     */
    codeBlock?: boolean;
    /**
     * Document block
     */
    document?: boolean;
    /**
     * Embed block
     */
    embedBlock?: boolean;
    /**
     * Heading block
     */
    heading?: boolean;
    /**
     * HTML block
     */
    htmlBlock?: boolean;
    /**
     * List block
     */
    list?: boolean;
    /**
     * List item block
     */
    listItem?: boolean;
    /**
     * Math formula block
     */
    mathBlock?: boolean;
    /**
     * Paragraph block
     */
    paragraph?: boolean;
    /**
     * Super blok
     */
    superBlock?: boolean;
    /**
     * Table block
     */
    table?: boolean;
}

//#endregion content
