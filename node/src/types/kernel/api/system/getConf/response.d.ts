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
    export:      IExport;
    fileTree:    IExport;
    flashcard:   IFlashCard;
    graph:       IGraph;
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
    repo:     IRepo;
    search:   any;
    /**
     * Whether to display the changelog for this release version
     */
    showChangelog: boolean;
    snippet:       ISnippet;
    stat:          IStat;
    sync:          ISync;
    system:        ISystem;
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
    apiProvider: APIProvider;
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
    apiUserAgent: string;
    /**
     * API version number
     */
    apiVersion: string;
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
 * SiYuan export related configuration
 */
export interface IExport {
    /**
     * Add article title (insert the article title as a first-level title at the beginning of
     * the document)
     */
    addTitle: boolean;
    /**
     * Embedded block export mode
     * - `0`: Original block content
     * - `1`: Quotation block
     */
    blockEmbedMode: number;
    /**
     * Content block reference export mode
     * - `0`: Original text (deprecated)
     * - `1`: Quotation block (deprecated)
     * - `2`: Anchor text block link
     * - `3`: Anchor text only
     * - `4`: Footnote
     * - `5`: Anchor hash
     */
    blockRefMode: number;
    /**
     * The symbol on the left side of the block reference anchor text during export
     */
    blockRefTextLeft: string;
    /**
     * The symbol on the right side of the block reference anchor text during export
     */
    blockRefTextRight: string;
    /**
     * The path of the template file used when exporting to Docx
     */
    docxTemplate: string;
    /**
     * File annotation reference export mode
     * - `0`: File name - page number - anchor text
     * - `1`: Anchor text only
     */
    fileAnnotationRefMode: number;
    /**
     * Custom watermark position, size, style, etc. when exporting to an image
     */
    imageWatermarkDesc: string;
    /**
     * The watermark text or watermark file path used when exporting to an image
     */
    imageWatermarkStr: string;
    /**
     * Whether to add YAML Front Matter when exporting to Markdown
     */
    markdownYFM: boolean;
    /**
     * Pandoc executable file path
     */
    pandocBin: string;
    /**
     * Whether the beginning of the paragraph is empty two spaces.
     * Insert two full-width spaces `U+3000` at the beginning of the paragraph.
     */
    paragraphBeginningSpace: boolean;
    /**
     * Custom footer content when exporting to PDF
     */
    pdfFooter: string;
    /**
     * Custom watermark position, size, style, etc. when exporting to PDF
     */
    pdfWatermarkDesc: string;
    /**
     * The watermark text or watermark file path used when exporting to PDF
     */
    pdfWatermarkStr: string;
    /**
     * Tag close marker symbol
     */
    tagCloseMarker: string;
    /**
     * Tag start marker symbol
     */
    tagOpenMarker: string;
}

/**
 * Flashcard related configuration
 */
export interface IFlashCard {
    /**
     * Whether to enable deck card making
     */
    deck: boolean;
    /**
     * Whether to enable heading block card making
     */
    heading: boolean;
    /**
     * Whether to enable list block card making
     */
    list: boolean;
    /**
     * Whether to enable mark element card making
     */
    mark: boolean;
    /**
     * Maximum interval days
     */
    maximumInterval: number;
    /**
     * New card limit
     */
    newCardLimit: number;
    /**
     * FSRS request retention parameter
     */
    requestRetention: number;
    /**
     * Review card limit
     */
    reviewCardLimit: number;
    /**
     * Review mode
     * - `0`: New and old mixed
     * - `1`: New card priority
     * - `2`: Old card priority
     */
    reviewMode: number;
    /**
     * Whether to enable super block card making
     */
    superBlock: boolean;
    /**
     * FSRS weight parameter list
     */
    weights: string;
}

/**
 * SiYuan graph related configuration
 */
export interface IGraph {
    global: IGraphGlobal;
    local:  IGraphLocal;
    /**
     * Maximum number of content blocks displayed
     */
    maxBlocks: number;
}

/**
 * Global graph configuration
 */
export interface IGraphGlobal {
    d3: IGraphD3;
    /**
     * Whether to display nodes in daily notes
     */
    dailyNote: boolean;
    /**
     * The minimum number of references to the displayed node
     */
    minRefs: number;
    type:    IGraphType;
}

/**
 * d3.js graph configuration
 */
export interface IGraphD3 {
    /**
     * Whether to display the arrow
     */
    arrow: boolean;
    /**
     * Central gravity intensity
     */
    centerStrength: number;
    /**
     * Repulsion radius
     */
    collideRadius: number;
    /**
     * Repulsion intensity
     */
    collideStrength: number;
    /**
     * Line opacity
     */
    lineOpacity: number;
    /**
     * Link distance
     */
    linkDistance: number;
    /**
     * Line width
     */
    linkWidth: number;
    /**
     * Node size
     */
    nodeSize: number;
}

/**
 * SiYuan node type filter
 */
export interface IGraphType {
    /**
     * Display quote block
     */
    blockquote: boolean;
    /**
     * Display code block
     */
    code: boolean;
    /**
     * Display heading block
     */
    heading: boolean;
    /**
     * Display list block
     */
    list: boolean;
    /**
     * Display list item
     */
    listItem: boolean;
    /**
     * Display formula block
     */
    math: boolean;
    /**
     * Display paragraph block
     */
    paragraph: boolean;
    /**
     * Display super block
     */
    super: boolean;
    /**
     * Display table block
     */
    table: boolean;
    /**
     * Display tag
     */
    tag: boolean;
}

/**
 * Local graph configuration
 */
export interface IGraphLocal {
    d3: IGraphD3;
    /**
     * Whether to display nodes in daily notes
     */
    dailyNote: boolean;
    type:      IGraphType;
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
 * Snapshot repository related configuration
 */
export interface IRepo {
    /**
     * Snapshot encryption key (base64 encoded 256-bit key)
     */
    key: string;
    /**
     * Synchronous index timing, if it exceeds this time, the user is prompted that the index
     * performance is degraded (unit: milliseconds)
     */
    syncIndexTiming: number;
}

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
 * SiYuan workspace content statistics
 */
export interface IStat {
    /**
     * Asset file size (unit: bytes)
     */
    assetsSize: number;
    /**
     * Number of content blocks
     */
    blockCount: number;
    /**
     * Size of resource files after chunk encryption (unit: bytes)
     */
    cAssetsSize: number;
    /**
     * Number of content blocks after chunk encryption
     */
    cBlockCount: number;
    /**
     * Size of the data directory after chunk encryption (unit: bytes)
     */
    cDataSize: number;
    /**
     * Number of content block trees after chunk encryption (number of documents)
     */
    cTreeCount: number;
    /**
     * Data directory size (unit: bytes)
     */
    dataSize: number;
    /**
     * Number of content block trees (number of documents)
     */
    treeCount: number;
}

/**
 * SiYuan synchronization related configuration
 */
export interface ISync {
    /**
     * Cloud workspace name
     */
    cloudName: string;
    /**
     * Whether to enable synchronization
     */
    enabled: boolean;
    /**
     * Whether to create a conflict document when a conflict occurs during synchronization
     */
    generateConflictDoc: boolean;
    /**
     * Synchronization mode
     * - `0`: Not set
     * - `1`: Automatic synchronization
     * - `2`: Manual synchronization
     * - `3`: Completely manual synchronization
     */
    mode: number;
    /**
     * Whether to enable synchronization perception
     */
    perception: boolean;
    /**
     * Cloud storage service provider
     * - `0`: SiYuan official cloud storage service
     * - `1`: Object storage service compatible with S3 protocol
     * - `2`: Network storage service using WebDAV protocol
     */
    provider: number;
    s3:       Is3;
    /**
     * The prompt information of the last synchronization
     */
    stat: string;
    /**
     * The time of the last synchronization (Unix timestamp)
     */
    synced: number;
    webdav: IWebDAV;
}

/**
 * S3 compatible object storage related configuration
 */
export interface Is3 {
    /**
     * Access key
     */
    accessKey: string;
    /**
     * Bucket name
     */
    bucket: string;
    /**
     * Service endpoint address
     */
    endpoint: string;
    /**
     * Whether to use path-style URLs
     */
    pathStyle: boolean;
    /**
     * Storage region
     */
    region: string;
    /**
     * Security key
     */
    secretKey: string;
    /**
     * Whether to skip TLS verification
     */
    skipTlsVerify: boolean;
    /**
     * Timeout (unit: seconds)
     */
    timeout: number;
}

/**
 * WebDAV related configuration
 */
export interface IWebDAV {
    /**
     * Service endpoint
     */
    endpoint: string;
    /**
     * Password
     */
    password: string;
    /**
     * Whether to skip TLS verification
     */
    skipTlsVerify: boolean;
    /**
     * Timeout (unit: seconds)
     */
    timeout: number;
    /**
     * Username
     */
    username: string;
}

/**
 * System related information
 */
export interface ISystem {
    /**
     * The absolute path of the `resources` directory under the SiYuan installation directory
     */
    appDir: string;
    /**
     * Boot automatically
     */
    autoLaunch: boolean;
    /**
     * The absolute path of the `conf` directory of the current workspace
     */
    confDir: string;
    /**
     * Kernel operating environment
     * - `docker`: Docker container
     * - `android`: Android device
     * - `ios`: iOS device
     * - `std`: Desktop Electron environment
     */
    container: Container;
    /**
     * The absolute path of the `data` directory of the current workspace
     */
    dataDir: string;
    /**
     * Whether to disable Google Analytics
     */
    disableGoogleAnalytics: boolean;
    /**
     * Whether to automatically download the installation package for the new version
     */
    downloadInstallPkg: boolean;
    /**
     * The absolute path of the user's home directory for the current operating system user
     */
    homeDir: string;
    /**
     * The UUID of the current session
     */
    id: string;
    /**
     * Whether the current version is an internal test version
     */
    isInsider: boolean;
    /**
     * Whether the current version is a Microsoft Store version
     */
    isMicrosoftStore: boolean;
    /**
     * Kernel version number
     */
    kernelVersion: string;
    /**
     * Lock screen mode
     * - `0`: Manual
     * - `1`: Manual + Follow the operating system
     */
    lockScreenMode: number;
    /**
     * The name of the current device
     */
    name:         string;
    networkProxy: INetworkProxy;
    /**
     * Whether to enable network serve (whether to allow connections from other devices)
     */
    networkServe: boolean;
    /**
     * The operating system name determined at compile time (obtained using the command `go tool
     * dist list`)
     * - `android`: Android
     * - `darwin`: macOS
     * - `ios`: iOS
     * - `linux`: Linux
     * - `windows`: Windows
     */
    os: OS;
    /**
     * Operating system platform name
     */
    osPlatform: string;
    /**
     * Whether to upload error logs
     */
    uploadErrLog: boolean;
    /**
     * The absolute path of the workspace directory
     */
    workspaceDir: string;
}

/**
 * Kernel operating environment
 * - `docker`: Docker container
 * - `android`: Android device
 * - `ios`: iOS device
 * - `std`: Desktop Electron environment
 */
export type Container = "docker" | "android" | "ios" | "std";

/**
 * SiYuan Network proxy configuration
 */
export interface INetworkProxy {
    /**
     * Host name or host address
     */
    host: string;
    /**
     * Proxy server port number
     */
    port: string;
    /**
     * The protocol used by the proxy server
     * - Empty String: Use the system proxy settings
     * - `http`: HTTP
     * - `https`: HTTPS
     * - `socks5`: SOCKS5
     */
    scheme: Scheme;
}

/**
 * The protocol used by the proxy server
 * - Empty String: Use the system proxy settings
 * - `http`: HTTP
 * - `https`: HTTPS
 * - `socks5`: SOCKS5
 */
export type Scheme = "" | "http" | "https" | "socks5";

/**
 * The operating system name determined at compile time (obtained using the command `go tool
 * dist list`)
 * - `android`: Android
 * - `darwin`: macOS
 * - `ios`: iOS
 * - `linux`: Linux
 * - `windows`: Windows
 */
export type OS = "android" | "darwin" | "ios" | "linux" | "windows";

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
