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
 * Upload assets
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
 * the result of uploading assets
 */
export interface IData {
    readonly errFiles: null | string[];
    /**
     * Files that failed to upload (in upload order)
     */
    readonly failedFiles: IFailedFile[];
    /**
     * Files uploaded successfully (in upload order)
     */
    readonly succFiles: ISuccFile[];
    readonly succMap: { [key: string]: string };
}

/**
 * A file that failed to upload
 */
export interface IFailedFile {
    /**
     * Reason of the failure
     */
    readonly error: string;
    /**
     * Index of the file in the uploaded files (starting from 0)
     */
    readonly index: number;
    /**
     * File name when uploading
     */
    readonly name: string;
}

/**
 * A file uploaded successfully
 */
export interface ISuccFile {
    /**
     * Index of the file in the uploaded files (starting from 0)
     */
    readonly index: number;
    /**
     * File name when uploading
     */
    readonly name: string;
    /**
     * Asset path (relative to the `data` directory), which can be used to reference the asset
     */
    readonly path: string;
}

// #endregion content
