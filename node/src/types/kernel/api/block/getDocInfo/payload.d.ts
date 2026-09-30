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
 * Get document information
 */
export interface IPayload {
    /**
     * block ID
     */
    readonly id: string;
    /**
     * Additional block IDs, only used to check whether the encrypted notebooks containing them
     * are unlocked
     */
    readonly ids?: string[];
    /**
     * ID of the encrypted notebook containing the block, required for blocks in encrypted
     * notebooks
     */
    readonly notebook?: string;
}

// #endregion content
