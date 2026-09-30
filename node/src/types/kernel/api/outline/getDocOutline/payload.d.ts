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
 * Gets the document outline
 */
export interface IPayload {
    /**
     * Block ID
     */
    readonly id: string;
    /**
     * ID of the encrypted notebook containing the document, required for documents in encrypted
     * notebooks
     */
    readonly notebook?: string;
    /**
     * Whether it is for the export preview (the document title becomes a top-level outline node
     * when adding titles is enabled for exports)
     */
    readonly preview?: boolean;
}

// #endregion content
