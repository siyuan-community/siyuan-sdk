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
 * Query the list of historical items
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
    readonly items: IItem[];
}

/**
 * History item
 */
export interface IItem {
    /**
     * ID of the object in the history (the document ID for documents, the attribute view ID for
     * databases, may be empty for assets)
     */
    readonly id: string;
    /**
     * ID of the notebook containing the document (only meaningful for document histories)
     */
    readonly notebook: string;
    /**
     * Operation that produced the history
     * - `clean`: Clean up unused assets or databases
     * - `update`: Update
     * - `delete`: Delete
     * - `format`: Format
     * - `sync`: Overwritten by sync
     * - `replace`: Replace
     * - `outline`: Edit in the outline panel
     */
    readonly op: THistoryOperation;
    /**
     * Absolute path of the historical document file
     */
    readonly path: string;
    /**
     * Historical document title
     */
    readonly title: string;
}

/**
 * Operation that produced the history
 * - `clean`: Clean up unused assets or databases
 * - `update`: Update
 * - `delete`: Delete
 * - `format`: Format
 * - `sync`: Overwritten by sync
 * - `replace`: Replace
 * - `outline`: Edit in the outline panel
 */
export type THistoryOperation = "clean" | "delete" | "format" | "outline" | "replace" | "sync" | "update";

// #endregion content
