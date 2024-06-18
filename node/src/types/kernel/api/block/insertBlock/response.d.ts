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
 * Insert blocks
 */
export interface IResponse {
    /**
     * status code
     */
    code: number;
    data: ITransaction[];
    /**
     * status message
     */
    msg: string;
}

/**
 * Insert transactions
 *
 * Insert transaction
 */
export interface ITransaction {
    doOperations: IOperation[];
    /**
     * timestamp
     */
    timestamp: number;
    /**
     * undo operation list
     */
    undoOperations: null;
}

/**
 * insert operation list
 *
 * insert operation
 */
export interface IOperation {
    /**
     * operation action type
     */
    action: Action;
    /**
     * HTML DOM of inserting blocks
     */
    data: string;
    /**
     * block ID: the first inserting block
     */
    id: string;
    /**
     * block ID: insert before this block
     */
    nextID: string;
    /**
     * block ID: insert into this block
     */
    parentID: string;
    /**
     * block ID: insert after this block
     */
    previousID: string;
    [property: string]: any;
}

export type Action = "insert";

// #endregion content
