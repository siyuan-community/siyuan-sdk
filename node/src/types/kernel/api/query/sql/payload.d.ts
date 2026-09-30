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
 * query the database using SQL
 */
export interface IPayload {
    /**
     * Statement check mode
     * - Empty string: A single statement
     * - `readonly`: A single read-only statement
     * - `multiple`: Multiple statements, the result of the last one is returned
     */
    readonly mode?: TSQLMode;
    /**
     * SQL query statements
     */
    readonly stmt: string;
}

/**
 * Statement check mode
 * - Empty string: A single statement
 * - `readonly`: A single read-only statement
 * - `multiple`: Multiple statements, the result of the last one is returned
 */
export type TSQLMode = "" | "multiple" | "readonly";

// #endregion content
