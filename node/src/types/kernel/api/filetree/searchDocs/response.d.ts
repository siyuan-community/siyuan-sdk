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
 * Search Document by Keyword
 */
export interface IResponse {
    /**
     * status code
     */
    code: number;
    /**
     * document info list
     */
    data: IDocInfo[];
    /**
     * status message
     */
    msg: string;
}

export interface IDocInfo {
    /**
     * Document Block ID
     */
    box: string;
    /**
     * Notebook icon
     */
    boxIcon: string;
    /**
     * Number of expired cards
     */
    dueFlashcardCount?: number;
    /**
     * Total number of cards
     */
    flashcardCount?: number;
    /**
     * The readable path that contains the name of the notebook
     */
    hPath: string;
    /**
     * Number of new cards
     */
    newFlashcardCount?: number;
    /**
     * Directory path
     */
    path: string;
    [property: string]: any;
}
