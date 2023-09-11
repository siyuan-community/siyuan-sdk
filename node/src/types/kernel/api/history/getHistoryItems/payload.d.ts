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
 * Query the list of historical items
 */
export interface IPayload {
    /**
     * The timestamp of history item creation
     */
    created: string;
    /**
     * The notebook ID of the query
     */
    notebook?: string;
    /**
     * Operation type
     * Filter based on the reason established by the history
     */
    op?: Op;
    /**
     * Query keywords, which can be document block IDs
     */
    query: string;
    /**
     * Query scheme
     * 0: Search docs by doc name
     * 1: Search docs by doc name and content
     * 2: Search assets
     * 3: Search docs by doc id
     */
    type?: number;
}

/**
 * Operation type
 * Filter based on the reason established by the history
 */
export type Op = "all" | "clean" | "update" | "delete" | "format" | "sync" | "replace";

//#endregion content
