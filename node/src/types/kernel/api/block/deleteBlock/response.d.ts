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
 * Delete a block
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
 * Delete transactions
 *
 * Delete transaction
 */
export interface ITransaction {
    doOperations: IOperation[];
    /**
     * undo operation list
     */
    undoOperations: null;
}

/**
 * Delete operation list
 *
 * Delete operation
 */
export interface IOperation {
    /**
     * operation action type
     */
    action: Action;
    /**
     * HTML DOM of updating blocks
     */
    data: null;
    /**
     * ID of the block to be deleted
     */
    id:       string;
    parentID: any;
    [property: string]: any;
}

export type Action = "delete";
