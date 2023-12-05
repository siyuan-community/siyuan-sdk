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
 * Get the content of a shorthand
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
 * Response information
 */
export interface IData {
    /**
     * Human-friendly creation time
     */
    hCreated: string;
    /**
     * shorthand object ID
     */
    oId: string;
    /**
     * shorthand article content (HTML)
     */
    shorthandContent: string;
    /**
     * shorthand article description
     */
    shorthandDesc: string;
    /**
     * shorthand source type
     */
    shorthandFrom: number;
    /**
     * shorthand article content (Markdown)
     */
    shorthandMd: string;
    /**
     * shorthand article title
     */
    shorthandTitle: string;
    /**
     * shorthand original URL address
     */
    shorthandURL: string;
}

//#endregion content
