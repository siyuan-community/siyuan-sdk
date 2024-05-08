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
 * Theme resource manifest file definition
 */
export interface ITheme {
    author:         string;
    description?:   Description;
    displayName?:   Description;
    funding?:       Funding;
    keywords?:      string[];
    minAppVersion?: string;
    modes?:         IThem[];
    name:           string;
    readme?:        Description;
    url:            string;
    version:        string;
    [property: string]: any;
}

/**
 * The description of the resource
 *
 * Localize text fields
 *
 * The display name of the resource
 *
 * The readme file name of the resource
 */
export interface Description {
    /**
     * The default text
     */
    default: string;
    /**
     * The English text
     */
    en_US?: string;
    /**
     * The Traditional Chinese text
     */
    zh_CHT?: string;
    /**
     * The Simplified Chinese text
     */
    zh_CN?: string;
    [property: string]: any;
}

/**
 * The funding of the resource
 */
export interface Funding {
    /**
     * The custom funding URLs
     */
    custom?: string[];
    /**
     * The GitHub sponsors username, such as https://github.com/sponsors/<username>
     */
    github?: string;
    /**
     * The Open Collective username, such as https://opencollective.com/<username>
     */
    openCollective?: string;
    /**
     * The Patreon username, such as https://www.patreon.com/<username>
     */
    patreon?: string;
}

/**
 * The modes supported by the theme
 *
 * The mode supported by the theme
 */
export type IThem = "dark" | "light";

//#endregion content
