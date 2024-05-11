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
    /**
     * The modes supported by the theme
     */
    modes?: TMode[];
    /**
     * The name of the author
     */
    author: string;
    /**
     * The description of the resource
     */
    description?: ILocalizedText;
    /**
     * The display name of the resource
     */
    displayName?: ILocalizedText;
    /**
     * The funding of the resource
     */
    funding?: IFunding;
    /**
     * The keywords of the resource used for search
     */
    keywords?: string[];
    /**
     * The minimum version of SiYuan that the resource is compatible with
     */
    minAppVersion?: string;
    /**
     * The name of the resource
     */
    name: string;
    /**
     * The readme file name of the resource
     */
    readme?: ILocalizedText;
    /**
     * The GitHub repository URL of the resource
     */
    url: string;
    /**
     * The version of the resource
     */
    version: string;
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
export interface ILocalizedText {
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
export interface IFunding {
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
 * The mode supported by the theme
 */
export type TMode = "light" | "dark";

//#endregion content
