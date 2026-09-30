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
 * Gets the document information where the block in
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
     * Notebook ID
     */
    readonly box?: string;
    /**
     * Document path, which needs to start with / and separate levels with /
     * path here corresponds to the database path field
     */
    readonly path?: string;
    /**
     * Whether the document requires a password in the publish service, only present when
     * required, in which case `box`, `path` and `rootChildID` are omitted
     */
    readonly publishAccessRequired?: boolean;
    /**
     * Block ID without parent block
     */
    readonly rootChildID?: string;
    /**
     * Document icon
     */
    readonly rootIcon: string;
    /**
     * Document block ID
     */
    readonly rootID: string;
    /**
     * Document title
     */
    readonly rootTitle: string;
    /**
     * Whether the document title is marked as empty (`rootTitle` is a placeholder in that case)
     */
    readonly rootTitleEmpty: boolean;
}

// #endregion content
