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

//#region content
/**
 * List sub docs by path
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
    /**
     * notebook ID
     */
    box:   string;
    files: IFile[];
    /**
     * document file/folder path
     */
    path: string;
}

/**
 * Document information
 */
export interface IFile {
    /**
     * document alias
     */
    alias: string;
    /**
     * document bookmark
     */
    bookmark: string;
    /**
     * document reference count
     */
    count: number;
    /**
     * document created time (Unix timestamp, unit: s)
     */
    ctime: number;
    /**
     * due flashcard count
     */
    dueFlashcardCount: number;
    /**
     * flashcard count
     */
    flashcardCount: number;
    /**
     * human readable document created time
     */
    hCtime: string;
    /**
     * is hidden
     */
    hidden: boolean;
    /**
     * human readable document modified time
     */
    hMtime: string;
    /**
     * human readable document size
     */
    hSize: string;
    /**
     * document icon
     */
    icon: string;
    /**
     * document ID
     */
    id: string;
    /**
     * document memo
     */
    memo: string;
    /**
     * document modified time (Unix timestamp, unit: s)
     */
    mtime: number;
    /**
     * document title
     */
    name: string;
    /**
     * document name
     */
    name1: string;
    /**
     * new flashcard count
     */
    newFlashcardCount: number;
    /**
     * file path of document
     */
    path: string;
    /**
     * document size (unit: Byte)
     */
    size: number;
    /**
     * document sort rule
     * 0: Name Alphabet ASC
     * 1: Name Alphabet DESC
     * 2: Modified Time ASC
     * 3: Modified Time DESC
     * 4: Name Natural ASC
     * 5: Name Natural DESC
     * 6: Custom Sorting
     * 7: Ref Count ASC
     * 8: Ref Count DESC
     * 9: Created Time ASC
     * 10: Created Time DESC
     * 11: Document Size ASC
     * 12: Document Size DESC
     * 13: Sub-docs Count ASC
     * 14: Sub-docs Count DESC
     * 15: Use doc tree sorting rule
     * 256: (default) Use notebook sorting rule
     */
    sort: number;
    /**
     * sub file count
     */
    subFileCount: number;
}

//#endregion content
