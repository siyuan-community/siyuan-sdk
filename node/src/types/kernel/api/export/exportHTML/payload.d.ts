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
 * Exports the specified document block as HTML
 */
export interface IPayload {
    /**
     * Whether to add the document title at the beginning, the export setting is used by default
     */
    readonly addTitle?: boolean;
    /**
     * Custom title, only used when `addTitle` is `true`, the document title is used when empty
     */
    readonly customTitle?: string;
    /**
     * doc block ID
     */
    readonly id: string;
    /**
     * Whether to keep the folding state
     */
    readonly keepFold?: boolean;
    /**
     * Whether to merge the content of the sub-document
     */
    readonly merge?: boolean;
    /**
     * How headings in the content are handled when merging sub-documents, only used when
     * `merge` is `true`
     * - `preserve`: Keep the heading levels
     * - `demote`: Demote the headings to levels below the title of their document
     */
    readonly mergeContentHeadingMode?: TMergeContentHeadingMode;
    /**
     * Levels of the sub-document titles when merging sub-documents, only used when `merge` is
     * `true`
     * - Empty string: Level by document depth
     * - `flat`: All level 1
     * - `tree`: Level by document depth, one level lower when the root title is added
     */
    readonly mergeDocHeadingMode?: TMergeDocHeadingMode;
    /**
     * Whether the export format is PDF
     */
    readonly pdf: boolean;
    /**
     * Export directory, exported to a temporary directory under `temp/export/` when empty (see
     * `folder` in the response)
     */
    readonly savePath?: string;
}

/**
 * How headings in the content are handled when merging sub-documents, only used when
 * `merge` is `true`
 * - `preserve`: Keep the heading levels
 * - `demote`: Demote the headings to levels below the title of their document
 */
export type TMergeContentHeadingMode = "demote" | "preserve";

/**
 * Levels of the sub-document titles when merging sub-documents, only used when `merge` is
 * `true`
 * - Empty string: Level by document depth
 * - `flat`: All level 1
 * - `tree`: Level by document depth, one level lower when the root title is added
 */
export type TMergeDocHeadingMode = "" | "flat" | "tree";

// #endregion content
