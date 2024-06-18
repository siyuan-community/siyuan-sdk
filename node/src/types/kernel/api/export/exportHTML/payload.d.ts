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

// #region content
/**
 * Exports the specified document block as HTML
 */
export interface IPayload {
    /**
     * doc block ID
     */
    id: string;
    /**
     * Whether to keep the folding state
     */
    keepFold?: boolean;
    /**
     * Whether to merge the content of the sub-document
     */
    merge?: boolean;
    /**
     * Whether the export format is PDF
     */
    pdf: boolean;
    /**
     * The location where the file is saved
     */
    savePath: string;
}

// #endregion content
