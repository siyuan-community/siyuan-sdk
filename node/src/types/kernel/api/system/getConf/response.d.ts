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
    appearance:     IAppearance;
    bazaar:         IBazaar;
    /**
     * Cloud Service Provider Region
     * - `0`: Chinese mainland
     * - `1`: North America
     */
    cloudRegion: number;
    editor:      IEditor;
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
     * API Provider
     */
    apiProvider?: APIProvider;
    /**
     * API request proxy address
     */
    apiProxy: string;
    /**
     * API request timeout (unit: seconds)
     */
    apiTimeout: number;
    /**
     * API request additional user agent field
     */
    apiUserAgent?: string;
}

/**
 * The model name called by the API
 */
export type TOpenAIModel = "gpt-4" | "gpt-4-32k" | "gpt-3.5-turbo" | "gpt-3.5-turbo-16k";

/**
 * API Provider
 */
export type APIProvider = "OpenAI" | "Azure";

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
 * SiYuan appearance related configuration
 */
export interface IAppearance {
    /**
     * Close button behavior
     * - `0`: Exit application
     * - `1`: Minimize to pallets
     */
    closeButtonBehavior: number;
    /**
     * Dark code block theme
     */
    codeBlockThemeDark: string;
    /**
     * Light code block theme
     */
    codeBlockThemeLight: string;
    /**
     * List of installed dark themes
     */
    darkThemes: string[];
    /**
     * Whether to hide status bar
     */
    hideStatusBar: boolean;
    /**
     * The name of the icon currently in use
     */
    icon: string;
    /**
     * List of installed icon names
     */
    icons: string[];
    /**
     * The version number of the icon currently in use
     */
    iconVer: string;
    /**
     * The language used by the current user
     */
    lang: TLang;
    /**
     * List of installed light themes
     */
    lightThemes: string[];
    /**
     * The current theme mode
     * - `0`: Light theme
     * - `1`: Dark theme
     */
    mode: number;
    /**
     * Whether the theme mode follows the system theme
     */
    modeOS: boolean;
    /**
     * The name of the dark theme currently in use
     */
    themeDark: string;
    /**
     * Whether the current theme has enabled theme JavaScript
     */
    themeJS: boolean;
    /**
     * The name of the light theme currently in use
     */
    themeLight: string;
    /**
     * The version number of the theme currently in use
     */
    themeVer: string;
}

/**
 * The language used by the current user
 *
 * User interface language
 * Same as {@link IAppearance.lang}
 */
export type TLang = "en_US" | "es_ES" | "fr_FR" | "zh_CHT" | "zh_CN";

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
 * SiYuan editor related configuration
 */
export interface IEditor {
    /**
     * The default number of backlinks to expand
     */
    backlinkExpandCount: number;
    /**
     * The default number of backlinks to mention
     */
    backmentionExpandCount: number;
    /**
     * The maximum length of the dynamic anchor text for block references
     */
    blockRefDynamicAnchorTextMaxLen: number;
    /**
     * Whether the code block has enabled ligatures
     */
    codeLigatures: boolean;
    /**
     * Whether the code block is automatically wrapped
     */
    codeLineWrap: boolean;
    /**
     * Whether the code block displays line numbers
     */
    codeSyntaxHighlightLineNum: boolean;
    /**
     * The number of spaces generated by the Tab key in the code block, configured as 0 means no
     * conversion to spaces
     */
    codeTabSpaces: number;
    /**
     * Whether to display the bookmark icon
     */
    displayBookmarkIcon: boolean;
    /**
     * Whether to display the network image mark
     */
    displayNetImgMark: boolean;
    /**
     * The number of blocks loaded each time they are dynamically loaded
     */
    dynamicLoadBlocks: number;
    /**
     * Whether the embedded block displays breadcrumbs
     */
    embedBlockBreadcrumb: boolean;
    /**
     * Common emoji icons
     */
    emoji: string[];
    /**
     * The trigger mode of the preview window
     * - `0`: Hover over the cursor
     * - `1`: Hover over the cursor while holding down Ctrl
     * - `2`: Do not trigger the floating window
     */
    floatWindowMode: number;
    /**
     * The font used in the editor
     */
    fontFamily: string;
    /**
     * The font size used in the editor
     */
    fontSize: number;
    /**
     * Whether to enable the use of the mouse wheel to adjust the font size of the editor
     */
    fontSizeScrollZoom: boolean;
    /**
     * Whether the editor uses maximum width
     */
    fullWidth: boolean;
    /**
     * The time interval for generating document history, set to 0 to disable document history
     * (unit: minutes)
     */
    generateHistoryInterval: number;
    /**
     * History retention days
     */
    historyRetentionDays: number;
    /**
     * Whether to enable text justification
     */
    justify: boolean;
    /**
     * KeTex macro definition (JSON string)
     */
    katexMacros: string;
    /**
     * Whether to enable single-click list item mark focus
     */
    listItemDotNumberClickFocus: boolean;
    /**
     * Whether to enable the list logical reverse indentation scheme
     */
    listLogicalOutdent: boolean;
    /**
     * Whether to enable the `[[` symbol to search only for document blocks
     */
    onlySearchForDoc: boolean;
    /**
     * PlantUML rendering service address
     */
    plantUMLServePath: string;
    /**
     * Whether to enable read-only mode
     */
    readOnly: boolean;
    /**
     * Whether to enable RTL (left-to-right chirography) mode
     */
    rtl: boolean;
    /**
     * Whether to enable spell checking
     */
    spellcheck: boolean;
    /**
     * Whether to enable virtual references
     */
    virtualBlockRef: boolean;
    /**
     * Virtual reference keyword exclusion list (separated by commas `,`)
     */
    virtualBlockRefExclude: string;
    /**
     * Virtual reference keyword inclusion list (separated by commas `,`)
     */
    virtualBlockRefInclude: string;
}

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
