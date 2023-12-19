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
    ai:             IAI;
    api:            IAPI;
    appearance:     any;
    bazaar:         IBazaar;
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
    lang: TLang;
    /**
     * List of supported languages
     */
    langs: ILang[];
    /**
     * A list of the IP addresses of the devices on which the kernel resides
     */
    localIPs: string[];
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
    snippet:       ISnippet;
    stat:          any;
    sync:          any;
    system:        any;
    tag:           ITag;
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
 * Artificial Intelligence (AI) related configuration
 */
export interface IAI {
    openAI: IOpenAI;
}

/**
 * Open AI related configuration
 */
export interface IOpenAI {
    /**
     * API base URL
     */
    apiBaseURL: string;
    /**
     * API key
     */
    apiKey: string;
    /**
     * Maximum number of tokens (0 means no limit)
     */
    apiMaxTokens: number;
    /**
     * The model name called by the API
     */
    apiModel: TOpenAIModel;
    /**
     * API request proxy address
     */
    apiProxy: string;
    /**
     * API request timeout (unit: seconds)
     */
    apiTimeout: number;
}

/**
 * The model name called by the API
 */
export type TOpenAIModel = "gpt-4" | "gpt-4-32k" | "gpt-3.5-turbo" | "gpt-3.5-turbo-16k";

/**
 * SiYuan API related configuration
 */
export interface IAPI {
    /**
     * API Token
     */
    token: string;
}

/**
 * SiYuan bazaar related configuration
 */
export interface IBazaar {
    /**
     * Whether to disable all plug-ins
     */
    petalDisabled: boolean;
    /**
     * Whether to trust (enable) the resources for the bazaar
     */
    trust: boolean;
}

/**
 * User interface language
 * Same as {@link IAppearance.lang}
 */
export type TLang = "en_US" | "es_ES" | "fr_FR" | "zh_CHT" | "zh_CN";

/**
 * Supported language
 */
export interface ILang {
    /**
     * Language name
     */
    label: string;
    /**
     * Language identifier
     */
    name: string;
}

/**
 * Log level
 */
export type TLogLevel = "off" | "trace" | "debug" | "info" | "warn" | "error" | "fatal";

/**
 * SiYuan code snippets related configuration
 */
export interface ISnippet {
    /**
     * Whether to enable CSS code snippets
     */
    enabledCSS: boolean;
    /**
     * Whether to enable JavaScript code snippets
     */
    enabledJS: boolean;
}

/**
 * SiYuan tag dock related configuration
 */
export interface ITag {
    /**
     * Tag sorting scheme
     * - `0`: Name alphabetically ascending
     * - `1`: Name alphabetically descending
     * - `4`: Name natural ascending
     * - `5`: Name natural descending
     * - `7`: Reference count ascending
     * - `8`: Reference count descending
     */
    sort: number;
}

//#endregion content
