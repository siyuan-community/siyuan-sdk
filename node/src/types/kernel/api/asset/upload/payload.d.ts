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

/**
 * Upload assets
 */
export interface IPayload {
    /**
     * The folder path where assets are stored
     * with the data folder as the root path
     * @example "/assets/": workspace/data/assets/
     * @example "/assets/sub/": workspace/data/assets/sub/
     * @default "/assets/"
     */
    assetsDirPath?: string;
    /**
     * Uploaded file list
     */
    files: File[];
}