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

//#region content
/**
 * List notebooks
 */
export interface IResponse {
    /**
     * status code
     */
    code: number;
    data: IData;
    /**
     * status message
     */
    msg: string;
}

/**
 * response data
 */
export interface IData {
    notebooks: INotebook[];
}

/**
 * notebook list
 *
 * notebook object
 */
export interface INotebook {
    /**
     * notebook open state
     */
    closed: boolean;
    /**
     * the count of due flash card
     */
    dueFlashcardCount: number;
    /**
     * the count of flash card
     */
    flashcardCount: number;
    /**
     * notebook icon
     */
    icon: string;
    /**
     * notebook ID
     */
    id: string;
    /**
     * notebook name
     */
    name: string;
    /**
     * the count of new flash card
     */
    newFlashcardCount: number;
    /**
     * sequence number
     */
    sort: number;
    /**
     * document sorting mode
     */
    sortMode: number;
}

//#endregion content
