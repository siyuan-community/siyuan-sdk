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
    conf: IConf;
    /**
     * Whether the user interface is not loaded
     */
    start: boolean;
}

/**
 * Configuration object
 */
export interface IConf {
    /**
     * Access authorization code
     */
    accessAuthCode: AccessAuthCode;
    account:        IAccount;
    ai:             any;
    api:            any;
    appearance:     any;
    bazaar:         any;
    /**
     * Cloud Service Provider Region
     * - `0`: Chinese mainland
     * - `1`: North America
     */
    cloudRegion: number;
    editor:      any;
    export:      any;
    fileTree:    any;
    flashcard:   any;
    graph:       any;
    keymap:      any;
    /**
     * User interface language
     * Same as {@link IAppearance.lang}
     */
    lang:     TLang;
    langs:    any;
    localIPS: any;
    /**
     * Log level
     */
    logLevel: TLogLevel;
    /**
     * Whether to open the user guide after startup
     */
    openHelp: boolean;
    /**
     * Whether it is running in read-only mode
     */
    readonly: boolean;
    repo:     any;
    search:   any;
    /**
     * Whether to display the changelog for this release version
     */
    showChangelog: boolean;
    stat:          any;
    sync:          any;
    system:        any;
    tag:           any;
    uiLayout:      any;
    /**
     * Community user data (Encrypted)
     */
    userData: string;
}

/**
 * Access authorization code
 */
export type AccessAuthCode = "" | "*******";

/**
 * Account configuration
 */
export interface IAccount {
    /**
     * Display the title icon
     */
    displayTitle: boolean;
    /**
     * Display the VIP icon
     */
    displayVIP: boolean;
}

/**
 * User interface language
 * Same as {@link IAppearance.lang}
 */
export type TLang = "en_US" | "es_ES" | "fr_FR" | "zh_CHT" | "zh_CN";

/**
 * Log level
 */
export type TLogLevel = "off" | "trace" | "debug" | "info" | "warn" | "error" | "fatal";

//#endregion content
