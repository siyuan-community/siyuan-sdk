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
 * Get the full configuration of the workspace
 */
export interface IResponse {
    /**
     * status code
     */
    readonly code: number;
    readonly data: IData;
    /**
     * status message
     */
    readonly msg: string;
}

/**
 * response data
 */
export interface IData {
    readonly conf: IConf;
    /**
     * Whether it is in publish mode
     */
    readonly isPublish: boolean;
    /**
     * Whether the user interface is not loaded
     */
    readonly start: boolean;
}

/**
 * Configuration object
 */
export interface IConf {
    /**
     * Access authorization code
     */
    readonly accessAuthCode: TAccessAuthCode;
    readonly ai: Iai;
    readonly api: IAPI;
    readonly appearance: IAppearance;
    readonly bazaar: IBazaar;
    /**
     * Cloud Service Provider Region
     * - `0`: Chinese mainland
     * - `1`: North America
     */
    readonly cloudRegion: number;
    /**
     * Key used to encrypt session cookies (always an empty string in this API)
     */
    readonly cookieKey: string;
    /**
     * Data index status
     * - `0`: Indexed
     * - `1`: Not indexed
     */
    readonly dataIndexState: number;
    readonly editor: IEditor;
    readonly export: IExport;
    readonly fileTree: IFileTree;
    readonly flashcard: IFlashCard;
    readonly graph: IGraph;
    readonly keymap: IKeymap;
    /**
     * User interface language
     * Same as {@link IAppearance.lang}
     */
    readonly lang: TLang;
    /**
     * List of supported languages
     */
    readonly langs: ILang[];
    /**
     * Log level
     */
    readonly logLevel: TLogLevel;
    /**
     * Encrypted MCP OAuth credentials (always an empty string in this API)
     */
    readonly mcpOAuth: string;
    readonly notebookCrypto: INotebookCrypto;
    readonly oidc: IOidc;
    readonly onboarding: IOnboarding;
    readonly publish: IPublish;
    /**
     * Whether it is running in read-only mode
     */
    readonly readonly: boolean;
    readonly repo: IRepo;
    readonly search: ISearch;
    readonly secrets: ISecrets;
    /**
     * Kernel server addresses (LAN IPv4 addresses and 127.0.0.1), empty for non-administrator
     * roles
     */
    readonly serverAddrs: string[];
    /**
     * Whether to display the changelog for this release version
     */
    readonly showChangelog: boolean;
    readonly snippet: ISnippet;
    readonly stat: IStat;
    readonly sync: ISync;
    readonly system: ISystem;
    readonly tag: ITag;
    readonly uiLayout: IUILayout;
    /**
     * Community user data (Encrypted)
     */
    readonly userData: string;
    readonly variables: IVariables;
}

/**
 * Access authorization code
 */
export type TAccessAuthCode = "" | "*******";

/**
 * Artificial Intelligence (AI) related configuration
 */
export interface Iai {
    readonly agent: IAIAgent;
    readonly decision: IAIDecision;
    readonly editing: IAIEditing;
    readonly embedding: IAIEmbedding;
    readonly imageGeneration: IAIImageGeneration;
    readonly mcp: IAIMCP;
    /**
     * Model providers
     */
    readonly providers: IAIProvider[];
    readonly rerank: IAIRerank;
}

/**
 * AI agent configuration
 */
export interface IAIAgent {
    readonly approvalPolicy: IAIAgentApprovalPolicy;
    readonly capabilityPolicy: IAICapabilityPolicy;
    /**
     * Timeout for waiting for user confirmations and answers (unit: s), `0` means no limit
     */
    readonly confirmTimeout: number;
    /**
     * Maximum output tokens per reply, `0` means not set
     */
    readonly maxCompletionTokens: number;
    /**
     * Retries for failed model requests
     */
    readonly maxRetries: number;
    /**
     * Maximum tool call rounds per user turn, `0` or less means unlimited
     */
    readonly maxToolCallRounds: number;
    /**
     * ID of the model used by the agent (`ai.providers[].models[].id`)
     */
    readonly modelId: string;
    /**
     * Total session timeout (unit: s), `0` means unlimited
     */
    readonly sessionTimeout: number;
    readonly skills: IAIAgentSkills;
    /**
     * Streaming idle timeout (unit: s), the reply is aborted when no output arrives within it
     */
    readonly streamIdleTimeout: number;
    /**
     * Sampling temperature
     */
    readonly temperature: number;
}

/**
 * Approval policy for agent tool calls
 */
export interface IAIAgentApprovalPolicy {
    /**
     * Global approval mode
     * - `risk`: Ask for confirmation according to the operation risk
     * - `allow`: Approve automatically
     */
    readonly default: TAIAgentApprovalPolicyDefault;
    /**
     * Approval overrides keyed by capability ID, such as `native/backend/<tool>` or
     * `mcp/backend/<server ID>/<tool>`
     */
    readonly overrides: { [key: string]: IAIAgentCapabilityApproval };
}

/**
 * Global approval mode
 * - `risk`: Ask for confirmation according to the operation risk
 * - `allow`: Approve automatically
 */
export type TAIAgentApprovalPolicyDefault = "allow" | "risk";

/**
 * Approval override of a capability
 */
export interface IAIAgentCapabilityApproval {
    /**
     * Approval modes by the value of the `action` argument of the tool
     */
    readonly actions: { [key: string]: TAIAgentApproval };
    /**
     * Approval mode of the capability, an empty string inherits the global mode
     * - `allow`: Approve automatically
     * - `confirm`: Always ask for confirmation
     * - `risk`: Ask for confirmation according to the operation risk
     */
    readonly default: TAIAgentApprovalOverride;
}

/**
 * Approval mode
 * - `allow`: Approve automatically
 * - `confirm`: Always ask for confirmation
 * - `risk`: Ask for confirmation according to the operation risk
 */
export type TAIAgentApproval = "allow" | "confirm" | "risk";

/**
 * Approval mode of the capability, an empty string inherits the global mode
 * - `allow`: Approve automatically
 * - `confirm`: Always ask for confirmation
 * - `risk`: Ask for confirmation according to the operation risk
 */
export type TAIAgentApprovalOverride = "" | "allow" | "confirm" | "risk";

/**
 * Policy of which capabilities (tools) are available
 */
export interface IAICapabilityPolicy {
    readonly default: TAICapabilityPolicy;
    /**
     * Policy overrides keyed by capability ID
     */
    readonly overrides: { [key: string]: TAICapabilityPolicy };
}

/**
 * Capability policy
 * - `allow`: Available
 * - `deny`: Unavailable
 */
export type TAICapabilityPolicy = "allow" | "deny";

/**
 * Agent skills configuration
 */
export interface IAIAgentSkills {
    /**
     * Enabled user-level skills (directory names under `~/.agents/skills`)
     */
    readonly userEnabled: string[];
}

/**
 * Decision model (TypeSafe System One) configuration, which provides the decision tool to
 * the agent
 */
export interface IAIDecision {
    /**
     * API key
     */
    readonly apiKey: string;
    /**
     * Whether to enable the decision model
     */
    readonly enabled: boolean;
    /**
     * Service endpoint
     */
    readonly endpoint: string;
    /**
     * Model name
     */
    readonly name: string;
    /**
     * Request timeout (unit: s)
     */
    readonly timeout: number;
}

/**
 * In-editor AI configuration
 */
export interface IAIEditing {
    /**
     * Maximum output tokens per reply, `0` means not set
     */
    readonly maxCompletionTokens: number;
    /**
     * Number of previous turns kept as context
     */
    readonly maxHistoryMessages: number;
    /**
     * ID of the model used (`ai.providers[].models[].id`)
     */
    readonly modelId: string;
    /**
     * Sampling temperature
     */
    readonly temperature: number;
}

/**
 * Embedding model configuration, used for recall in semantic search
 */
export interface IAIEmbedding {
    /**
     * API key
     */
    readonly apiKey: string;
    /**
     * API base URL
     */
    readonly baseURL: string;
    /**
     * Dimensions of the output vectors, `0` means the default of the model
     */
    readonly dimensions: number;
    /**
     * Whether to enable embeddings
     */
    readonly enabled: boolean;
    /**
     * Configuration ID
     */
    readonly id: string;
    /**
     * Model name
     */
    readonly name: string;
    /**
     * Request timeout (unit: s)
     */
    readonly timeout: number;
}

/**
 * Image generation configuration
 */
export interface IAIImageGeneration {
    /**
     * ID of the model used (`ai.providers[].models[].id`), may be empty
     */
    readonly modelId: string;
    /**
     * Output image format
     */
    readonly outputFormat: TAIImageGenerationOutputFormat;
    /**
     * Default image quality, passed to the provider as is
     */
    readonly quality: string;
    /**
     * Request timeout (unit: s)
     */
    readonly requestTimeout: number;
    /**
     * Default image size, passed to the provider as is
     */
    readonly size: string;
}

/**
 * Output image format
 */
export type TAIImageGenerationOutputFormat = "jpeg" | "png" | "webp";

/**
 * MCP (Model Context Protocol) configuration
 */
export interface IAIMCP {
    readonly exposurePolicy: IAICapabilityPolicy;
    /**
     * External MCP servers the agent connects to
     */
    readonly servers: IAIMCPServer[];
}

/**
 * External MCP server
 */
export interface IAIMCPServer {
    /**
     * Command arguments (stdio)
     */
    readonly args: string[];
    /**
     * Executable to launch (stdio)
     */
    readonly command: string;
    /**
     * Whether to disable the standalone SSE stream of Streamable HTTP
     */
    readonly disableStandaloneSSE: boolean;
    /**
     * Whether to enable the server
     */
    readonly enabled: boolean;
    /**
     * Environment variables of the process (stdio), supporting `{{secrets.X}}` and `{{vars.X}}`
     */
    readonly env: { [key: string]: string };
    /**
     * HTTP request headers (http), supporting secret and variable placeholders
     */
    readonly headers: { [key: string]: string };
    /**
     * Server ID (UUID)
     */
    readonly id: string;
    /**
     * Names of environment variables inherited from the kernel process (stdio)
     */
    readonly inheritEnv: string[];
    /**
     * Display name
     */
    readonly name: string;
    /**
     * Timeout for connecting, listing tools and calling tools (unit: s), `30` when `0` or less
     */
    readonly timeout: number;
    /**
     * Whether to trust the `readOnlyHint` annotations declared by the server
     */
    readonly trustToolAnnotations: boolean;
    /**
     * Transport type
     */
    readonly type: TAIMCPServerType;
    /**
     * Server URL (http)
     */
    readonly url: string;
}

/**
 * Transport type
 */
export type TAIMCPServerType = "http" | "stdio";

/**
 * Model provider
 */
export interface IAIProvider {
    /**
     * API key
     */
    readonly apiKey: string;
    /**
     * API base URL, the official OpenAI URL (Anthropic URL for `anthropic-messages`) when empty
     */
    readonly baseURL: string;
    /**
     * Display name
     */
    readonly displayName?: string;
    /**
     * Whether to enable the provider
     */
    readonly enabled: boolean;
    /**
     * Custom request headers, supporting secret and variable placeholders
     */
    readonly headers?: { [key: string]: string };
    /**
     * Provider ID
     */
    readonly id: string;
    /**
     * Models
     */
    readonly models: IAIProviderModel[];
    /**
     * API protocol
     * - `openai`: OpenAI Chat Completions
     * - `openai-responses`: OpenAI Responses
     * - `anthropic-messages`: Anthropic Messages
     */
    readonly protocol?: TAIProviderProtocol;
    /**
     * Request timeout (unit: s)
     */
    readonly requestTimeout: number;
}

/**
 * Model of a provider
 */
export interface IAIProviderModel {
    /**
     * Context window size (tokens), `0` means inferred automatically
     */
    readonly contextLength?: number;
    /**
     * Display name
     */
    readonly displayName?: string;
    /**
     * Whether to enable the model
     */
    readonly enabled: boolean;
    /**
     * Model entry ID, referenced by the `modelId` fields
     */
    readonly id: string;
    /**
     * Model name sent to the API
     */
    readonly name: string;
}

/**
 * API protocol
 * - `openai`: OpenAI Chat Completions
 * - `openai-responses`: OpenAI Responses
 * - `anthropic-messages`: Anthropic Messages
 */
export type TAIProviderProtocol = "anthropic-messages" | "openai-responses" | "openai";

/**
 * Rerank model configuration, used to rerank semantic search results
 */
export interface IAIRerank {
    /**
     * API key
     */
    readonly apiKey: string;
    /**
     * Number of candidates sent to rerank after vector recall
     */
    readonly candidateCount: number;
    /**
     * Whether to enable reranking
     */
    readonly enabled: boolean;
    /**
     * Full endpoint URL of the rerank service
     */
    readonly endpoint: string;
    /**
     * Configuration ID
     */
    readonly id: string;
    /**
     * Model name
     */
    readonly name: string;
    /**
     * Request format
     */
    readonly requestFormat: TAIRerankRequestFormat;
    /**
     * Request timeout (unit: s)
     */
    readonly timeout: number;
}

/**
 * Request format
 */
export type TAIRerankRequestFormat = "cohere" | "dashscope";

/**
 * SiYuan API related configuration
 */
export interface IAPI {
    /**
     * API Token
     */
    readonly token: string;
}

/**
 * SiYuan appearance related configuration
 */
export interface IAppearance {
    /**
     * Body background gradient, colors are derived from the workspace name when `null`
     */
    readonly bodyGradient: IAppearanceBodyGradient | null;
    /**
     * Close button behavior
     * - `0`: Exit application
     * - `1`: Minimize to pallets
     */
    readonly closeButtonBehavior: number;
    /**
     * Dark code block theme
     */
    readonly codeBlockThemeDark: string;
    /**
     * Light code block theme
     */
    readonly codeBlockThemeLight: string;
    /**
     * List of installed dark themes
     */
    readonly darkThemes: IAppearanceThemeItem[];
    readonly entryVisibility: IAppearanceEntryVisibility;
    /**
     * Global default fonts in descending order of priority
     */
    readonly globalFontFamilies: IFont[];
    /**
     * Whether to hide status bar
     */
    readonly hideStatusBar: boolean;
    /**
     * Whether to merge the tab bar into the top bar
     */
    readonly hideToolbar: boolean;
    /**
     * The name of the icon currently in use
     */
    readonly icon: string;
    /**
     * List of installed icons
     */
    readonly icons: IAppearanceIconItem[];
    /**
     * The version number of the icon currently in use
     */
    readonly iconVer: string;
    /**
     * The language used by the current user
     */
    readonly lang: TLang;
    /**
     * List of installed light themes
     */
    readonly lightThemes: IAppearanceThemeItem[];
    /**
     * The current theme mode
     * - `0`: Light theme
     * - `1`: Dark theme
     */
    readonly mode: number;
    /**
     * Whether the theme mode follows the system theme
     */
    readonly modeOS: boolean;
    readonly notifications: IAppearanceNotifications;
    readonly statusBar: IAppearanceStatusBar;
    /**
     * The name of the dark theme currently in use
     */
    readonly themeDark: string;
    /**
     * Whether the current theme has enabled theme JavaScript
     */
    readonly themeJS: boolean;
    /**
     * The name of the light theme currently in use
     */
    readonly themeLight: string;
    /**
     * The version number of the theme currently in use
     */
    readonly themeVer: string;
}

/**
 * Body background gradient
 */
export interface IAppearanceBodyGradient {
    readonly dark: IAppearanceBodyGradientColor;
    readonly light: IAppearanceBodyGradientColor;
    /**
     * Gradient mode
     * - `auto`: Automatic
     * - `custom`: Custom
     * - `off`: Off
     */
    readonly mode: TAppearanceBodyGradientMode;
}

/**
 * Gradient color
 */
export interface IAppearanceBodyGradientColor {
    /**
     * Gradient color (hex RGB)
     */
    readonly color: string;
    /**
     * Opacity at the start of the gradient
     */
    readonly opacity: number;
}

/**
 * Gradient mode
 * - `auto`: Automatic
 * - `custom`: Custom
 * - `off`: Off
 */
export type TAppearanceBodyGradientMode = "auto" | "custom" | "off";

/**
 * Theme item
 */
export interface IAppearanceThemeItem {
    /**
     * Frontends supported by the theme (`all`, `desktop`, `desktop-window`, `mobile`,
     * `browser-desktop`, `browser-mobile`), all frontends except `mobile` and `browser-mobile`
     * when omitted
     */
    readonly frontends?: string[];
    /**
     * Appearance theme label
     */
    readonly label: string;
    /**
     * Appearance theme name
     */
    readonly name: string;
}

/**
 * Visibility and order of desktop UI entries (top bar, status bar, menus, toolbars and
 * docks)
 */
export interface IAppearanceEntryVisibility {
    /**
     * ID of the active profile: the built-in `simple` or `full`, or the ID of a custom profile
     */
    readonly active: string;
    /**
     * Custom profiles (the built-in profiles are not included)
     */
    readonly profiles: IAppearanceEntryVisibilityProfile[];
    /**
     * Version of the configuration structure
     */
    readonly version: number;
}

/**
 * Custom profile of entry visibility and order
 */
export interface IAppearanceEntryVisibilityProfile {
    /**
     * Map from entry paths (such as `document.more.editMode`) to visibility, unlisted entries
     * use their default visibility
     */
    readonly entries: { [key: string]: boolean };
    /**
     * Profile ID
     */
    readonly id: string;
    /**
     * Profile name
     */
    readonly name: string;
    /**
     * Map from parent entry paths to the order of their child entries
     */
    readonly orders: { [key: string]: string[] };
}

/**
 * Font
 */
export interface IFont {
    /**
     * Display name
     */
    readonly displayName: string;
    /**
     * Font family
     */
    readonly family: string;
    /**
     * Font weight
     */
    readonly weight: number;
}

/**
 * Icon item
 */
export interface IAppearanceIconItem {
    /**
     * Icon label
     */
    readonly label: string;
    /**
     * Icon name (directory name)
     */
    readonly name: string;
}

/**
 * The language used by the current user
 *
 * User interface language
 * Same as {@link IAppearance.lang}
 */
export type TLang = "ar" | "de" | "en" | "es" | "fr" | "he" | "hi" | "id" | "it" | "ja" | "ko" | "nl" | "pl" | "pt-BR" | "ru" | "sk" | "sr" | "th" | "tr" | "uk" | "zh-CN" | "zh-TW";

/**
 * Switches of built-in notifications and tips
 */
export interface IAppearanceNotifications {
    /**
     * Whether to show the browser compatibility notice
     */
    readonly browserCompatibility: boolean;
    /**
     * Whether to notify when the number of documents expanded in the document tree reaches the
     * limit
     */
    readonly docTreeMaxList: boolean;
    /**
     * Whether to show the tip of the format painter, shown when omitted
     */
    readonly formatPainterTip?: boolean;
    /**
     * Whether to show a tip when select-all in the editor is incomplete, shown when omitted
     */
    readonly selectAllIncompleteTip?: boolean;
    /**
     * Whether to show the tip of select-all in the editor, shown when omitted
     */
    readonly selectAllTip?: boolean;
    /**
     * Whether to notify when the number of tags expanded in the tag panel reaches the limit
     */
    readonly tagMaxList: boolean;
    /**
     * Whether to warn when the workspace is not on an SSD
     */
    readonly workspaceNotSSD: boolean;
}

/**
 * Switches of status bar messages
 */
export interface IAppearanceStatusBar {
    /**
     * Whether to hide data sync messages
     */
    readonly msgDataSyncDisabled: boolean;
    /**
     * Whether to hide messages of asset content index commit tasks
     */
    readonly msgTaskAssetDatabaseIndexCommitDisabled: boolean;
    /**
     * Whether to hide messages of database index commit tasks
     */
    readonly msgTaskDatabaseIndexCommitDisabled: boolean;
    /**
     * Whether to hide messages of history database index commit tasks
     */
    readonly msgTaskHistoryDatabaseIndexCommitDisabled: boolean;
    /**
     * Whether to hide messages of history file generation tasks
     */
    readonly msgTaskHistoryGenerateFileDisabled: boolean;
    /**
     * Version of the configuration structure
     */
    readonly version: number;
}

/**
 * SiYuan bazaar related configuration
 */
export interface IBazaar {
    /**
     * Whether to disable all plug-ins
     */
    readonly petalDisabled: boolean;
    /**
     * Whether to trust (enable) the resources for the bazaar
     */
    readonly trust: boolean;
}

/**
 * SiYuan editor related configuration
 */
export interface IEditor {
    /**
     * Allow HTML blocks to run scripts
     */
    readonly allowHTMLBLockScript: boolean;
    /**
     * Whether to allow scripts in SVG images to run
     */
    readonly allowSVGScript: boolean;
    readonly assetOpen: IEditorAssetOpen;
    /**
     * Whether to detect the text direction of paragraphs and headings automatically (a manually
     * set direction takes precedence)
     */
    readonly autoDirection: boolean;
    /**
     * Sort order of references within a document
     * - `0`: Order in the document
     * - `1`: Anchor text ascending
     * - `2`: Anchor text descending
     */
    readonly backlinkBlockSort: number;
    /**
     * Whether the backlink panel contains children
     */
    readonly backlinkContainChildren: boolean;
    /**
     * The default number of backlinks to expand
     */
    readonly backlinkExpandCount: number;
    /**
     * Global sort order of backlinks
     * - `0`: Group by document (sorted by `backlinkSort` and `backlinkBlockSort`)
     * - `1`: Anchor text ascending
     * - `2`: Anchor text descending
     */
    readonly backlinkGlobalSort: number;
    /**
     * Whether to hide blocks that only contain block references in propagated backlinks of the
     * backlink panel
     */
    readonly backlinkHideReference: boolean;
    /**
     * Keywords excluded from backlink mentions, separated by commas
     */
    readonly backlinkMentionExclude: string;
    /**
     * Whether to show backlinks at the bottom of the document
     */
    readonly backlinkShowBottom: boolean;
    /**
     * Sort order of documents in backlinks (same values as the sort modes of the document tree)
     * - `0`/`1`: Name ascending/descending
     * - `2`/`3`: Modified time ascending/descending
     * - `4`/`5`: Natural name ascending/descending
     * - `9`/`10`: Created time ascending/descending
     */
    readonly backlinkSort: number;
    /**
     * The default number of backlinks to mention
     */
    readonly backmentionExpandCount: number;
    /**
     * Sort order of documents in backlink mentions (same values as `backlinkSort`)
     */
    readonly backmentionSort: number;
    /**
     * The maximum length of the dynamic anchor text for block references
     */
    readonly blockRefDynamicAnchorTextMaxLen: number;
    /**
     * Whether to check block references and database bindings before deleting or cutting
     */
    readonly checkBlockRef: boolean;
    /**
     * Code fonts in descending order of priority
     */
    readonly codeFontFamilies: IFont[];
    /**
     * Whether the code block has enabled ligatures
     */
    readonly codeLigatures: boolean;
    /**
     * Whether the code block is automatically wrapped
     */
    readonly codeLineWrap: boolean;
    /**
     * Whether the code block displays line numbers
     */
    readonly codeSyntaxHighlightLineNum: boolean;
    /**
     * The number of spaces generated by the Tab key in the code block, configured as 0 means no
     * conversion to spaces
     */
    readonly codeTabSpaces: number;
    /**
     * Minimum number of visible lines kept above and below the cursor when moving it vertically
     * with the keyboard
     */
    readonly cursorSurroundingLines: number;
    /**
     * Behavior when clicking a database badge
     * - `0`: Focus the block and expand the database panel
     * - `1`: Open the block attribute panel
     */
    readonly databaseAttrClickMode: number;
    /**
     * Whether to hide empty database attributes
     */
    readonly databaseAttrHideEmpty: boolean;
    /**
     * Whether to show database attributes at the top of the document
     */
    readonly databaseAttrShow: boolean;
    /**
     * Whether to show database attributes in tabs
     */
    readonly databaseAttrUseTabs: boolean;
    /**
     * Default state of database attributes
     * - `0`: Expanded
     * - `1`: Collapsed
     */
    readonly databaseAttrViewMode: number;
    /**
     * Whether to display the bookmark icon
     */
    readonly displayBookmarkIcon: boolean;
    /**
     * Whether to display the network image mark
     */
    readonly displayNetImgMark: boolean;
    /**
     * Whether to insert dragged HTML files as IFrame blocks
     */
    readonly dragHTMLFileToIframe: boolean;
    /**
     * The number of blocks loaded each time they are dynamically loaded
     */
    readonly dynamicLoadBlocks: number;
    /**
     * Whether the embedded block displays breadcrumbs
     */
    readonly embedBlockBreadcrumb: boolean;
    /**
     * Common emoji icons
     */
    readonly emoji: string[];
    /**
     * Hover delay before the float window opens (unit: ms), only used when `floatWindowMode` is
     * `0`
     */
    readonly floatWindowDelay: number;
    /**
     * The trigger mode of the preview window
     * - `0`: Hover over the cursor
     * - `1`: Hover over the cursor while holding down Ctrl
     * - `2`: Do not trigger the floating window
     */
    readonly floatWindowMode: number;
    /**
     * Editor fonts in descending order of priority
     */
    readonly fontFamilies: IFont[];
    /**
     * The font used in the editor
     */
    readonly fontFamily: string;
    /**
     * Display name of the preferred editor font (same as `fontFamilies[0].displayName`)
     */
    readonly fontFamilyDisplay: string;
    /**
     * The font size used in the editor
     */
    readonly fontSize: number;
    /**
     * Whether to enable the use of the mouse wheel to adjust the font size of the editor
     */
    readonly fontSizeScrollZoom: boolean;
    /**
     * Weight of the preferred editor font (same as `fontFamilies[0].weight`, `400` when no font
     * is set)
     */
    readonly fontWeight: number;
    /**
     * Whether the editor uses maximum width
     */
    readonly fullWidth: boolean;
    /**
     * The time interval for generating document history, set to 0 to disable document history
     * (unit: minutes)
     */
    readonly generateHistoryInterval: number;
    /**
     * Whether to search tags when typing `#`
     */
    readonly hashTagSearch: boolean;
    /**
     * Display mode of heading embed blocks
     * - `0`: The heading and the blocks below it
     * - `1`: Only the heading
     * - `2`: Only the blocks below the heading
     */
    readonly headingEmbedMode: number;
    /**
     * Whether to show automatic heading numbers
     */
    readonly headingNumber: boolean;
    /**
     * Heading number format, unknown values are treated as `decimal-hierarchical`
     */
    readonly headingNumberFormat: string;
    /**
     * History retention days
     */
    readonly historyRetentionDays: number;
    /**
     * Whether to enable text justification
     */
    readonly justify: boolean;
    /**
     * KeTex macro definition (JSON string)
     */
    readonly katexMacros: string;
    /**
     * Whether to keep dynamically loaded content blocks
     */
    readonly keepLoadedContent: boolean;
    /**
     * Whether to enable single-click list item mark focus
     */
    readonly listItemDotNumberClickFocus: boolean;
    /**
     * Whether to enable the list logical reverse indentation scheme
     */
    readonly listLogicalOutdent: boolean;
    readonly markdown: IEditorMarkdown;
    /**
     * Whether to enable the `[[` symbol to search only for document blocks
     */
    readonly onlySearchForDoc: boolean;
    /**
     * Whether to convert pasted URLs to links automatically
     */
    readonly pasteURLAutoConvert: boolean;
    /**
     * PlantUML rendering service address
     */
    readonly plantUMLServePath: string;
    /**
     * Whether to enable read-only mode
     */
    readonly readOnly: boolean;
    /**
     * Whether to enable RTL (left-to-right chirography) mode
     */
    readonly rtl: boolean;
    /**
     * Whether to enable spell checking
     */
    readonly spellcheck: boolean;
    /**
     * Languages used for spell checking
     */
    readonly spellcheckLanguages: string[];
    /**
     * Whether to enable virtual references
     */
    readonly virtualBlockRef: boolean;
    /**
     * Virtual reference keyword exclusion list (separated by commas `,`)
     */
    readonly virtualBlockRefExclude: string;
    /**
     * Virtual reference keyword inclusion list (separated by commas `,`)
     */
    readonly virtualBlockRefInclude: string;
}

/**
 * How assets are opened when clicked
 */
export interface IEditorAssetOpen {
    readonly altClick: TEditorAssetOpenMode;
    readonly click: TEditorAssetOpenMode;
    readonly ctrlClick: TEditorAssetOpenMode;
    readonly shiftClick: TEditorAssetOpenMode;
}

/**
 * How an asset is opened
 * - `follow-tab`: Follow the setting of opening tabs without splitting the screen
 * - `current`: Current tab area
 * - `right`: Right of the tab
 * - `bottom`: Below the tab
 * - `background`: Background tab
 * - `new-window`: New window
 * - `app`: Default application
 * - `folder`: Show in folder
 */
export type TEditorAssetOpenMode = "app" | "background" | "bottom" | "current" | "folder" | "follow-tab" | "new-window" | "right";

/**
 * Markdown syntax configuration
 */
export interface IEditorMarkdown {
    /**
     * Whether to enable the full-width task list syntax
     */
    readonly blockFullWidthTaskList: boolean;
    /**
     * Whether to enable the code block syntax using middle dots (`·`)
     */
    readonly codeBlockMiddleDot: boolean;
    /**
     * Whether to enable asterisk syntax `*foo*` `**bar**`
     */
    readonly inlineAsterisk: boolean;
    /**
     * Whether to enable the full-width inline strikethrough syntax
     */
    readonly inlineFullWidthStrikethrough: boolean;
    /**
     * Whether to enable the inline mark (highlight) syntax
     */
    readonly inlineMark: boolean;
    /**
     * Whether to enable inline formula syntax `$foo$`
     */
    readonly inlineMath: boolean;
    /**
     * Whether to enable strikethrough syntax `~~foo~~`
     */
    readonly inlineStrikethrough: boolean;
    /**
     * Whether to enable subscript syntax `~foo~`
     */
    readonly inlineSub: boolean;
    /**
     * Whether to enable superscript syntax `^foo^`
     */
    readonly inlineSup: boolean;
    /**
     * Whether to enable tag syntax `#foo#`
     */
    readonly inlineTag: boolean;
    /**
     * Whether to enable underscore syntax `_foo_` `__bar__`
     */
    readonly inlineUnderscore: boolean;
}

/**
 * SiYuan export related configuration
 */
export interface IExport {
    /**
     * Add article title (insert the article title as a first-level title at the beginning of
     * the document)
     */
    readonly addTitle: boolean;
    /**
     * Embedded block export mode
     * - `0`: Original block content
     * - `1`: Quotation block
     */
    readonly blockEmbedMode: number;
    /**
     * Content block reference export mode
     * - `0`: Original text (deprecated)
     * - `1`: Quotation block (deprecated)
     * - `2`: Anchor text block link
     * - `3`: Anchor text only
     * - `4`: Footnote
     * - `5`: Anchor hash
     */
    readonly blockRefMode: number;
    /**
     * The symbol on the left side of the block reference anchor text during export
     */
    readonly blockRefTextLeft: string;
    /**
     * The symbol on the right side of the block reference anchor text during export
     */
    readonly blockRefTextRight: string;
    /**
     * The path of the template file used when exporting to Docx
     */
    readonly docxTemplate: string;
    /**
     * File annotation reference export mode
     * - `0`: File name - page number - anchor text
     * - `1`: Anchor text only
     */
    readonly fileAnnotationRefMode: number;
    /**
     * Custom watermark position, size, style, etc. when exporting to an image
     */
    readonly imageWatermarkDesc: string;
    /**
     * The watermark text or watermark file path used when exporting to an image
     */
    readonly imageWatermarkStr: string;
    /**
     * Whether to also export related documents (documents of referenced blocks, linked blocks
     * and blocks bound to databases)
     */
    readonly includeRelatedDocs: boolean;
    /**
     * Whether to include sub-documents when exporting
     */
    readonly includeSubDocs: boolean;
    /**
     * Whether to export inline memos
     */
    readonly inlineMemo: boolean;
    /**
     * Whether to add YAML Front Matter when exporting to Markdown
     */
    readonly markdownYFM: boolean;
    /**
     * Pandoc executable file path
     */
    readonly pandocBin: string;
    /**
     * Extra command line arguments of Pandoc, line breaks are treated as spaces
     */
    readonly pandocParams: string;
    /**
     * Whether the beginning of the paragraph is empty two spaces.
     * Insert two full-width spaces `U+3000` at the beginning of the paragraph.
     */
    readonly paragraphBeginningSpace: boolean;
    /**
     * Custom footer content when exporting to PDF
     */
    readonly pdfFooter: string;
    /**
     * Custom watermark position, size, style, etc. when exporting to PDF
     */
    readonly pdfWatermarkDesc: string;
    /**
     * The watermark text or watermark file path used when exporting to PDF
     */
    readonly pdfWatermarkStr: string;
    /**
     * Whether to remove the IDs in asset file names when exporting Markdown
     */
    readonly removeAssetsID: boolean;
    /**
     * Tag close marker symbol
     */
    readonly tagCloseMarker: string;
    /**
     * Tag start marker symbol
     */
    readonly tagOpenMarker: string;
}

/**
 * Document tree related configuration
 */
export interface IFileTree {
    /**
     * Whether to allow the creation of sub-documents deeper than 7 levels
     */
    readonly allowCreateDeeper: boolean;
    /**
     * Whether to automatically locate the currently open document in the document tree
     */
    readonly alwaysSelectOpenedFile: boolean;
    /**
     * Whether to enable notebook documents (a notebook itself can hold content)
     */
    readonly boxDocEnabled: boolean;
    /**
     * Whether to close a tab by double-clicking it
     */
    readonly closeTabOnDoubleClick: boolean;
    /**
     * Whether to close all tabs when starting
     */
    readonly closeTabsOnStart: boolean;
    /**
     * Whether to create new documents at the top of the document tree
     */
    readonly createDocAtTop: boolean;
    /**
     * The notebook to storage the new document
     */
    readonly docCreateSaveBox: string;
    /**
     * The storage path of the new document
     */
    readonly docCreateSavePath: string;
    /**
     * Template path for new documents (relative to `data/templates/`), no template when empty,
     * the notebook setting takes precedence
     */
    readonly docCreateTemplatePath: string;
    /**
     * Whether clicking a document or notebook icon expands or collapses its child documents
     */
    readonly docIconClickExpand: boolean;
    /**
     * Warn when a document or database file is larger than this size (unit: MB)
     */
    readonly largeFileWarningSize: number;
    /**
     * The maximum number of documents listed
     */
    readonly maxListCount: number;
    /**
     * The maximum number of open tabs
     */
    readonly maxOpenTabCount: number;
    /**
     * Whether to avoid splitting the screen automatically when opening search, PDF and similar
     * tabs
     */
    readonly noSplitScreenWhenOpenTab: boolean;
    /**
     * Whether to open the file in the current tab
     */
    readonly openFilesUseCurrentTab: boolean;
    /**
     * Whether clicking the title of a parent document expands or collapses its child documents
     */
    readonly parentDocClickExpand: boolean;
    /**
     * Maximum number of recent documents listed
     */
    readonly recentDocsMaxListCount: number;
    /**
     * The notebook to storage the new document created using block references
     */
    readonly refCreateSaveBox: string;
    /**
     * The storage path of the new document created using block references
     */
    readonly refCreateSavePath: string;
    /**
     * Close the secondary confirmation when deleting a document
     */
    readonly removeDocWithoutConfirm: boolean;
    /**
     * ID of the notebook where shorthands are saved
     */
    readonly shorthandSaveBox: string;
    /**
     * Save path of shorthands (human-readable path, supporting template syntax)
     */
    readonly shorthandSavePath: string;
    /**
     * Document sorting method
     * - `0`: File name ascending
     * - `1`: File name descending
     * - `2`: File update time ascending
     * - `3`: File update time descending
     * - `4`: File name natural number ascending
     * - `5`: File name natural number descending
     * - `6`: Custom sorting
     * - `7`: Reference count ascending
     * - `8`: Reference count descending
     * - `9`: File creation time ascending
     * - `10`: File creation time descending
     * - `11`: File size ascending
     * - `12`: File size descending
     * - `13`: Sub-document count ascending
     * - `14`: Sub-document count descending
     * - `15`: Use document tree sorting rules
     * - `256`: Unspecified sorting rules, according to the notebook priority over the document
     * tree to obtain sorting rules
     */
    readonly sort: number;
    /**
     * How tabs are handled on startup
     * - `0`: Restore all tabs
     * - `1`: Restore all tabs and show the start page
     * - `2`: Close all tabs
     */
    readonly tabStartupMode: number;
    /**
     * Whether to save the content of the .sy file as a single-line JSON object
     */
    readonly useSingleLineSave: boolean;
    /**
     * Whether notebooks and documents without an icon use the default SVG icons
     */
    readonly useSVGDefaultIcon: boolean;
}

/**
 * Flashcard related configuration
 */
export interface IFlashCard {
    /**
     * Whether to make flashcards from blockquotes
     */
    readonly blockquote: boolean;
    /**
     * Whether to make flashcards from callouts
     */
    readonly callout: boolean;
    /**
     * Whether to enable deck card making
     */
    readonly deck: boolean;
    /**
     * Whether to enable heading block card making
     */
    readonly heading: boolean;
    /**
     * Whether to enable list block card making
     */
    readonly list: boolean;
    /**
     * Whether to enable mark element card making
     */
    readonly mark: boolean;
    /**
     * Maximum interval days
     */
    readonly maximumInterval: number;
    /**
     * New card limit
     */
    readonly newCardLimit: number;
    /**
     * FSRS request retention parameter
     */
    readonly requestRetention: number;
    /**
     * Review card limit
     */
    readonly reviewCardLimit: number;
    /**
     * Review mode
     * - `0`: New and old mixed
     * - `1`: New card priority
     * - `2`: Old card priority
     */
    readonly reviewMode: number;
    /**
     * Whether to enable super block card making
     */
    readonly superBlock: boolean;
    /**
     * FSRS weight parameter list
     */
    readonly weights: string;
}

/**
 * SiYuan graph related configuration
 */
export interface IGraph {
    readonly global: IGraphGlobal;
    readonly local: IGraphLocal;
    /**
     * Maximum number of content blocks displayed
     */
    readonly maxBlocks: number;
}

/**
 * Global graph configuration
 */
export interface IGraphGlobal {
    readonly d3: IGraphD3;
    /**
     * Whether to display nodes in daily notes
     */
    readonly dailyNote: boolean;
    /**
     * The minimum number of references to the displayed node
     */
    readonly minRefs: number;
    readonly type: IGraphType;
}

/**
 * d3.js graph configuration
 */
export interface IGraphD3 {
    /**
     * Whether to display the arrow
     */
    readonly arrow: boolean;
    /**
     * Central gravity intensity
     */
    readonly centerStrength: number;
    /**
     * Repulsion radius
     */
    readonly collideRadius: number;
    /**
     * Repulsion intensity
     */
    readonly collideStrength: number;
    /**
     * Line opacity
     */
    readonly lineOpacity: number;
    /**
     * Link distance
     */
    readonly linkDistance: number;
    /**
     * Line width
     */
    readonly linkWidth: number;
    /**
     * Node size
     */
    readonly nodeSize: number;
}

/**
 * SiYuan node type filter
 */
export interface IGraphType {
    /**
     * Display quote block
     */
    readonly blockquote: boolean;
    /**
     * Whether to show callout nodes
     */
    readonly callout: boolean;
    /**
     * Display code block
     */
    readonly code: boolean;
    /**
     * Display heading block
     */
    readonly heading: boolean;
    /**
     * Display list block
     */
    readonly list: boolean;
    /**
     * Display list item
     */
    readonly listItem: boolean;
    /**
     * Display formula block
     */
    readonly math: boolean;
    /**
     * Display paragraph block
     */
    readonly paragraph: boolean;
    /**
     * Display super block
     */
    readonly super: boolean;
    /**
     * Display table block
     */
    readonly table: boolean;
    /**
     * Display tag
     */
    readonly tag: boolean;
}

/**
 * Local graph configuration
 */
export interface IGraphLocal {
    readonly d3: IGraphD3;
    /**
     * Whether to display nodes in daily notes
     */
    readonly dailyNote: boolean;
    readonly type: IGraphType;
}

/**
 * SiYuan keymap related configuration
 */
export interface IKeymap {
    readonly editor: IKeymapEditor;
    readonly general: IKeymapGeneral;
    readonly plugin: { [key: string]: { [key: string]: IKey } };
}

/**
 * SiYuan editor shortcut keys
 */
export interface IKeymapEditor {
    readonly general: IKeymapEditorGeneral;
    readonly heading: IKeymapEditorHeading;
    readonly insert: IKeymapEditorInsert;
    readonly list: IKeymapEditorList;
    readonly table: IKeymapEditorTable;
}

/**
 * SiYuan editor general shortcut keys
 */
export interface IKeymapEditorGeneral {
    readonly ai: IKey;
    readonly aiWriting: IKey;
    readonly alignCenter: IKey;
    readonly alignLeft: IKey;
    readonly alignRight: IKey;
    readonly attr: IKey;
    readonly backlinks: IKey;
    readonly collapse: IKey;
    readonly copyBlockEmbed: IKey;
    readonly copyBlockRef: IKey;
    readonly copyHPath: IKey;
    readonly copyID: IKey;
    readonly copyPlainText: IKey;
    readonly copyProtocol: IKey;
    readonly copyProtocolInMd: IKey;
    readonly copyRichText: IKey;
    readonly copyText: IKey;
    readonly duplicate: IKey;
    readonly duplicateCompletely: IKey;
    readonly editMode: IKey;
    readonly exitFocus: IKey;
    readonly expand: IKey;
    readonly expandDown: IKey;
    readonly expandUp: IKey;
    readonly focusBreadcrumb: IKey;
    readonly foldChildHeadings: IKey;
    readonly foldRecursive: IKey;
    readonly foldSiblingHeadings: IKey;
    readonly fullscreen: IKey;
    readonly graphView: IKey;
    readonly hLayout: IKey;
    readonly insertAfter: IKey;
    readonly insertBefore: IKey;
    readonly insertBottom: IKey;
    readonly insertRight: IKey;
    readonly insertSuperBlockLeft: IKey;
    readonly insertSuperBlockRight: IKey;
    readonly jumpToParent: IKey;
    readonly jumpToParentNext: IKey;
    readonly jumpToParentPrev: IKey;
    readonly ltr: IKey;
    readonly moveToDown: IKey;
    readonly moveToUp: IKey;
    readonly netAssets2LocalAssets: IKey;
    readonly netImg2LocalAsset: IKey;
    readonly newContentFile: IKey;
    readonly newNameFile: IKey;
    readonly newNameSettingFile: IKey;
    readonly openBy: IKey;
    readonly openInNewTab: IKey;
    readonly optimizeTypography: IKey;
    readonly outline: IKey;
    readonly quickMakeCard: IKey;
    readonly redo: IKey;
    readonly refPopover: IKey;
    readonly refresh: IKey;
    readonly refTab: IKey;
    readonly rename: IKey;
    readonly rtl: IKey;
    readonly scrollPageDownWithoutMovingCaret: IKey;
    readonly scrollPageUpWithoutMovingCaret: IKey;
    readonly selectToPageEnd: IKey;
    readonly selectToPageStart: IKey;
    readonly showInFolder: IKey;
    readonly spaceRepetition: IKey;
    readonly switchAdjust: IKey;
    readonly switchReadonly: IKey;
    readonly undo: IKey;
    readonly vLayout: IKey;
}

/**
 * SiYuan shortcut key
 */
export interface IKey {
    /**
     * Custom shortcut key
     */
    readonly custom: string;
    /**
     * Default shortcut key
     */
    readonly default: string;
}

/**
 * SiYuan editor heading shortcut keys
 */
export interface IKeymapEditorHeading {
    readonly heading1: IKey;
    readonly heading2: IKey;
    readonly heading3: IKey;
    readonly heading4: IKey;
    readonly heading5: IKey;
    readonly heading6: IKey;
    readonly paragraph: IKey;
}

/**
 * SiYuan editor insert shortcut keys
 */
export interface IKeymapEditorInsert {
    readonly "appearance": IKey;
    readonly "bold": IKey;
    readonly "check": IKey;
    readonly "clearInline": IKey;
    readonly "code": IKey;
    readonly "inline-code": IKey;
    readonly "inline-math": IKey;
    readonly "italic": IKey;
    readonly "kbd": IKey;
    readonly "lastUsed": IKey;
    readonly "link": IKey;
    readonly "list": IKey;
    readonly "mark": IKey;
    readonly "memo": IKey;
    readonly "ordered-list": IKey;
    readonly "quote": IKey;
    readonly "ref": IKey;
    readonly "strike": IKey;
    readonly "sub": IKey;
    readonly "sup": IKey;
    readonly "table": IKey;
    readonly "tag": IKey;
    readonly "underline": IKey;
}

/**
 * SiYuan editor list shortcut keys
 */
export interface IKeymapEditorList {
    readonly appendListItem: IKey;
    readonly checkToggle: IKey;
    readonly indent: IKey;
    readonly mindmapAddChild: IKey;
    readonly mindmapAddSibling: IKey;
    readonly outdent: IKey;
    readonly prependListItem: IKey;
    readonly taskCompletionToggle: IKey;
}

/**
 * SiYuan editor table shortcut keys
 */
export interface IKeymapEditorTable {
    readonly "delete-column": IKey;
    readonly "delete-row": IKey;
    readonly "insertColumnLeft": IKey;
    readonly "insertColumnRight": IKey;
    readonly "insertRowAbove": IKey;
    readonly "insertRowBelow": IKey;
    readonly "moveToDown": IKey;
    readonly "moveToLeft": IKey;
    readonly "moveToRight": IKey;
    readonly "moveToUp": IKey;
}

/**
 * SiYuan general shortcut keys
 */
export interface IKeymapGeneral {
    readonly addToDatabase: IKey;
    readonly agentChat: IKey;
    readonly agentSend: IKey;
    readonly backlinks: IKey;
    readonly bookmark: IKey;
    readonly closeAll: IKey;
    readonly closeLeft: IKey;
    readonly closeOthers: IKey;
    readonly closeRight: IKey;
    readonly closeTab: IKey;
    readonly closeUnmodified: IKey;
    readonly commandPanel: IKey;
    readonly config: IKey;
    readonly dailyNote: IKey;
    readonly dataHistory: IKey;
    readonly decreaseEditorFontSize: IKey;
    readonly editReadonly: IKey;
    readonly enter: IKey;
    readonly enterBack: IKey;
    readonly fileTree: IKey;
    readonly globalGraph: IKey;
    readonly globalSearch: IKey;
    readonly goBack: IKey;
    readonly goForward: IKey;
    readonly goToEditTabNext: IKey;
    readonly goToEditTabPrev: IKey;
    readonly goToTab1: IKey;
    readonly goToTab2: IKey;
    readonly goToTab3: IKey;
    readonly goToTab4: IKey;
    readonly goToTab5: IKey;
    readonly goToTab6: IKey;
    readonly goToTab7: IKey;
    readonly goToTab8: IKey;
    readonly goToTab9: IKey;
    readonly goToTabNext: IKey;
    readonly goToTabPrev: IKey;
    readonly graphView: IKey;
    readonly inbox: IKey;
    readonly increaseEditorFontSize: IKey;
    readonly lockScreen: IKey;
    readonly mainMenu: IKey;
    readonly move: IKey;
    readonly newFile: IKey;
    readonly openContextMenu: IKey;
    readonly outline: IKey;
    readonly recentClosed: IKey;
    readonly recentDocs: IKey;
    readonly replace: IKey;
    readonly resetEditorFontSize: IKey;
    readonly riffCard: IKey;
    readonly search: IKey;
    readonly selectOpen1: IKey;
    readonly splitLR: IKey;
    readonly splitMoveB: IKey;
    readonly splitMoveR: IKey;
    readonly splitTB: IKey;
    readonly stickSearch: IKey;
    readonly switchBottomDock: IKey;
    readonly switchLeftDock: IKey;
    readonly switchRightDock: IKey;
    readonly switchTab: IKey;
    readonly syncNow: IKey;
    readonly tabToWindow: IKey;
    readonly tag: IKey;
    readonly toggleBottomDockPanel: IKey;
    readonly toggleDock: IKey;
    readonly toggleLeftDockPanel: IKey;
    readonly toggleRightDockPanel: IKey;
    readonly toggleWin: IKey;
    readonly unsplit: IKey;
    readonly unsplitAll: IKey;
}

/**
 * Supported language
 */
export interface ILang {
    /**
     * Language name
     */
    readonly label: string;
    /**
     * Language identifier
     */
    readonly name: string;
}

/**
 * Log level
 */
export type TLogLevel = "debug" | "error" | "fatal" | "info" | "off" | "trace" | "warn";

/**
 * Global key settings of encrypted notebooks
 */
export interface INotebookCrypto {
    /**
     * Idle time before encrypted notebooks are locked automatically (unit: min), `0` disables
     * auto-lock
     */
    readonly autoLockMinutes: number;
    /**
     * Key backup ID
     */
    readonly backupID?: string;
    /**
     * SHA-256 checksum (hex) of the key identity fields, used to detect corruption
     */
    readonly checksum?: string;
    /**
     * Creation or update time of the key backup (Unix timestamp, unit: s)
     */
    readonly createdAt?: number;
    /**
     * Whether encrypted notebooks are enabled
     */
    readonly enabled: boolean;
    /**
     * Previous KEKs encrypted with the current KEK (base64), used to recover notebooks whose
     * keys have not been re-wrapped
     */
    readonly historyKEKs?: string[];
    readonly kdfParams: INotebookCryptoKdfParams;
    /**
     * HMAC-SHA256 of the key backup keyed with the KEK (base64)
     */
    readonly kekMAC?: string;
    /**
     * Verifier encrypted with the KEK (base64) used to check the master password, `null` when
     * not enabled
     */
    readonly kekVerifier: null | string;
    /**
     * Global salt for deriving keys from the master password (base64), `null` when not enabled
     */
    readonly masterSalt: null | string;
    /**
     * Version of the key backup specification
     */
    readonly spec: number;
    /**
     * AES-GCM nonce of `kekVerifier` (base64), `null` when not enabled
     */
    readonly verifierNonce: null | string;
}

/**
 * Argon2id parameters
 */
export interface INotebookCryptoKdfParams {
    /**
     * Number of iterations (time cost)
     */
    readonly iterations: number;
    /**
     * Length of the derived key (unit: byte)
     */
    readonly keyLength: number;
    /**
     * Memory size (unit: KiB)
     */
    readonly memory: number;
    /**
     * Degree of parallelism (threads)
     */
    readonly parallelism: number;
}

/**
 * OpenID Connect sign-in configuration
 */
export interface IOidc {
    /**
     * Whether to admit all authenticated users, at least one claim rule is required when `false`
     */
    readonly allowAll: boolean;
    /**
     * Claim-based admission rules, all of which must be satisfied
     */
    readonly claimRules: IOidcClaimRule[];
    /**
     * OAuth client ID
     */
    readonly clientID: string;
    /**
     * OAuth client secret
     */
    readonly clientSecret: string;
    /**
     * Whether to enable OIDC sign-in
     */
    readonly enabled: boolean;
    /**
     * OIDC issuer URL
     */
    readonly issuerURL: string;
    /**
     * Identity provider
     */
    readonly provider: TOidcProvider;
    /**
     * Callback URL used for remote web sign-in
     */
    readonly redirectURL: string;
    /**
     * Requested OAuth scopes
     */
    readonly scopes: string[];
}

/**
 * Claim-based admission rule
 */
export interface IOidcClaimRule {
    /**
     * Claim name
     */
    readonly claim: string;
    /**
     * Match operator
     */
    readonly operator: TOidcClaimRuleOperator;
    /**
     * Accepted values, any of which matches
     */
    readonly values: string[];
}

/**
 * Match operator
 */
export type TOidcClaimRuleOperator = "contains" | "equals";

/**
 * Identity provider
 */
export type TOidcProvider = "custom" | "github" | "google" | "microsoft";

/**
 * Onboarding state
 */
export interface IOnboarding {
    /**
     * Whether the user has dismissed the onboarding
     */
    readonly dismissed: boolean;
    /**
     * ID of the document created for the onboarding
     */
    readonly documentID: string;
    /**
     * Whether the onboarding is for a new user
     */
    readonly newUser: boolean;
    /**
     * ID of the notebook used or created for the onboarding
     */
    readonly notebookID: string;
    /**
     * Onboarding progress
     */
    readonly state: TOnboardingState;
}

/**
 * Onboarding progress
 */
export type TOnboardingState = "completed" | "notebook-created" | "pending";

/**
 * Publish service related configuration
 */
export interface IPublish {
    /**
     * Publish service basic auth configuration
     */
    readonly auth: IPublishAuth;
    /**
     * Whether to enable the publishing service
     */
    readonly enable: boolean;
    /**
     * The port used by the publishing service
     */
    readonly port: number;
}

/**
 * Publish service basic auth configuration
 *
 * Publish service basic auth related configuration
 */
export interface IPublishAuth {
    /**
     * Publish service Basic authentication username/password list
     */
    readonly accounts: IPublishAuthAccount[];
    /**
     * Whether to enable publishing service basic authentication
     */
    readonly enable: boolean;
}

/**
 * Publish service basic auth account
 */
export interface IPublishAuthAccount {
    /**
     * Remarks information
     */
    readonly memo: string;
    /**
     * Basic authentication password
     */
    readonly password: string;
    /**
     * Basic authentication username
     */
    readonly username: string;
}

/**
 * Snapshot repository related configuration
 */
export interface IRepo {
    /**
     * Snapshot index retention days
     */
    readonly indexRetentionDays: number;
    /**
     * Snapshot encryption key (base64 encoded 256-bit key), `null` when not set
     */
    readonly key: null | string;
    /**
     * Number of snapshot indexes retained daily
     */
    readonly retentionIndexesDaily: number;
    /**
     * Synchronous index timing, if it exceeds this time, the user is prompted that the index
     * performance is degraded (unit: milliseconds)
     */
    readonly syncIndexTiming: number;
}

/**
 * SiYuan search related configuration
 */
export interface ISearch {
    /**
     * Whether to search in block aliases
     */
    readonly alias: boolean;
    /**
     * Whether to search in audio blocks
     */
    readonly audioBlock: boolean;
    /**
     * Extract backlink mention keywords from block aliases
     */
    readonly backlinkMentionAlias: boolean;
    /**
     * Extract backlink mention keywords from block reference anchor text
     */
    readonly backlinkMentionAnchor: boolean;
    /**
     * Extract backlink mention keywords from document names
     */
    readonly backlinkMentionDoc: boolean;
    /**
     * Maximum number of backlink mention keywords
     */
    readonly backlinkMentionKeywordsLimit: number;
    /**
     * Extract backlink mention keywords from block names
     */
    readonly backlinkMentionName: boolean;
    /**
     * Whether to search quote blocks
     */
    readonly blockquote: boolean;
    /**
     * Whether to search callouts
     */
    readonly callout: boolean;
    /**
     * Whether to distinguish between uppercase and lowercase letters when searching
     */
    readonly caseSensitive: boolean;
    /**
     * Whether to search code blocks
     */
    readonly codeBlock: boolean;
    /**
     * Whether to search custom blocks
     */
    readonly customBlock: boolean;
    /**
     * Whether to search database blocks
     */
    readonly databaseBlock: boolean;
    /**
     * Whether to search document blocks
     */
    readonly document: boolean;
    /**
     * Whether to search embedded blocks
     */
    readonly embedBlock: boolean;
    /**
     * Whether full-text search distinguishes Simplified and Traditional Chinese
     */
    readonly hanSensitive: boolean;
    /**
     * Whether to search heading blocks
     */
    readonly heading: boolean;
    /**
     * Whether to search HTML blocks
     */
    readonly htmlBlock: boolean;
    /**
     * Whether to search block attributes
     */
    readonly ial: boolean;
    /**
     * Whether to search in iframe blocks
     */
    readonly iframeBlock: boolean;
    /**
     * Whether to search resource file paths
     */
    readonly indexAssetPath: boolean;
    /**
     * Number of search results displayed
     */
    readonly limit: number;
    /**
     * Whether to search list blocks
     */
    readonly list: boolean;
    /**
     * Whether to search list items
     */
    readonly listItem: boolean;
    /**
     * Whether to search formula blocks
     */
    readonly mathBlock: boolean;
    /**
     * Whether to search block notes
     */
    readonly memo: boolean;
    /**
     * Whether to search mind map blocks
     */
    readonly mindmap: boolean;
    /**
     * Whether to search mind map item blocks
     */
    readonly mindmapItem: boolean;
    /**
     * Whether to search block names
     */
    readonly name: boolean;
    /**
     * Whether to search paragraph blocks
     */
    readonly paragraph: boolean;
    /**
     * Whether to search super blocks
     */
    readonly superBlock: boolean;
    /**
     * Whether to search tab item blocks
     */
    readonly tabItem: boolean;
    /**
     * Whether to search table blocks
     */
    readonly table: boolean;
    /**
     * Whether to search tabbed blocks
     */
    readonly tabs: boolean;
    /**
     * Whether to search in video blocks
     */
    readonly videoBlock: boolean;
    /**
     * Whether to get virtual reference keywords from block aliases
     */
    readonly virtualRefAlias: boolean;
    /**
     * Whether to get virtual reference keywords from block reference anchor text
     */
    readonly virtualRefAnchor: boolean;
    /**
     * Whether to get virtual reference keywords from document names
     */
    readonly virtualRefDoc: boolean;
    /**
     * Whether to get virtual reference keywords from block names
     */
    readonly virtualRefName: boolean;
    /**
     * Whether to search in widget blocks
     */
    readonly widgetBlock: boolean;
}

/**
 * Global secrets
 */
export interface ISecrets {
    /**
     * Secrets, referenced as `{{secrets.NAME}}` or `$NAME`
     */
    readonly items: ISecretsItem[];
}

/**
 * Secret
 */
export interface ISecretsItem {
    /**
     * Target hosts of HTTP requests allowed to use the secret (exact, case-insensitive match),
     * never used in HTTP requests when empty
     */
    readonly allowedHosts: string[];
    /**
     * Secret name
     */
    readonly name: string;
    /**
     * Secret value
     */
    readonly value: string;
}

/**
 * SiYuan code snippets related configuration
 */
export interface ISnippet {
    /**
     * Whether to enable CSS code snippets
     */
    readonly enabledCSS: boolean;
    /**
     * Whether to enable JavaScript code snippets
     */
    readonly enabledJS: boolean;
}

/**
 * SiYuan workspace content statistics
 */
export interface IStat {
    /**
     * Asset file size (unit: bytes)
     */
    readonly assetsSize: number;
    /**
     * Number of content blocks
     */
    readonly blockCount: number;
    /**
     * Size of resource files after chunk encryption (unit: bytes)
     */
    readonly cAssetsSize: number;
    /**
     * Number of content blocks after chunk encryption
     */
    readonly cBlockCount: number;
    /**
     * Size of the data directory after chunk encryption (unit: bytes)
     */
    readonly cDataSize: number;
    /**
     * Number of content block trees after chunk encryption (number of documents)
     */
    readonly cTreeCount: number;
    /**
     * Data directory size (unit: bytes)
     */
    readonly dataSize: number;
    /**
     * Number of content block trees (number of documents)
     */
    readonly treeCount: number;
}

/**
 * SiYuan synchronization related configuration
 */
export interface ISync {
    /**
     * How assets are downloaded on this device
     * - `0`: Download all assets
     * - `1`: Download on demand
     */
    readonly assetDownloadMode: number;
    /**
     * Cloud workspace name
     */
    readonly cloudName: string;
    /**
     * Whether to enable synchronization
     */
    readonly enabled: boolean;
    /**
     * Whether to create a conflict document when a conflict occurs during synchronization
     */
    readonly generateConflictDoc: boolean;
    /**
     * Automatic synchronization interval
     */
    readonly interval: number;
    readonly lan: ISyncLAN;
    readonly local: ISyncLocal;
    /**
     * Synchronization mode
     * - `0`: Not set
     * - `1`: Automatic synchronization
     * - `2`: Manual synchronization
     * - `3`: Completely manual synchronization
     */
    readonly mode: number;
    /**
     * Whether to enable synchronization perception
     */
    readonly perception: boolean;
    /**
     * Cloud storage service provider
     * - `0`: SiYuan official cloud storage service
     * - `2`: Object storage service compatible with S3 protocol
     * - `3`: Network storage service using WebDAV protocol
     */
    readonly provider: number;
    readonly s3: ISyncS3;
    /**
     * The prompt information of the last synchronization
     */
    readonly stat: string;
    /**
     * The time of the last synchronization (Unix timestamp)
     */
    readonly synced: number;
    readonly webdav: ISyncWebDAV;
}

/**
 * LAN sync acceleration configuration
 */
export interface ISyncLAN {
    /**
     * Whether to enable LAN sync acceleration
     */
    readonly enabled: boolean;
    /**
     * Maximum number of concurrent requests
     */
    readonly maxConcurrentReqs: number;
}

/**
 * Local folder sync configuration
 */
export interface ISyncLocal {
    /**
     * Number of concurrent requests
     */
    readonly concurrentReqs: number;
    /**
     * Local sync directory (separated by `/` and ending with `/`), an empty string when not
     * configured
     */
    readonly endpoint: string;
    /**
     * Timeout (unit: s)
     */
    readonly timeout: number;
}

/**
 * S3 compatible object storage related configuration
 */
export interface ISyncS3 {
    /**
     * Access key
     */
    readonly accessKey: string;
    /**
     * Bucket name
     */
    readonly bucket: string;
    /**
     * Connection concurrency
     */
    readonly concurrentReqs: number;
    /**
     * Service endpoint
     */
    readonly endpoint: string;
    /**
     * Whether to use path-style URLs
     */
    readonly pathStyle: boolean;
    /**
     * Storage region
     */
    readonly region: string;
    /**
     * Security key
     */
    readonly secretKey: string;
    /**
     * Whether to skip TLS verification
     */
    readonly skipTlsVerify: boolean;
    /**
     * Timeout (unit: seconds)
     */
    readonly timeout: number;
}

/**
 * WebDAV related configuration
 */
export interface ISyncWebDAV {
    /**
     * Connection concurrency
     */
    readonly concurrentReqs: number;
    /**
     * Service endpoint, an empty string when not configured
     */
    readonly endpoint: string;
    /**
     * Password
     */
    readonly password: string;
    /**
     * Whether to skip TLS verification
     */
    readonly skipTlsVerify: boolean;
    /**
     * Timeout (unit: seconds)
     */
    readonly timeout: number;
    /**
     * Username
     */
    readonly username: string;
}

/**
 * System related information
 */
export interface ISystem {
    /**
     * The absolute path of the `resources` directory under the SiYuan installation directory
     */
    readonly appDir: string;
    /**
     * Boot automatically mode
     * - `0`: Close automatically start
     * - `1`: Auto start
     * - `2`: Silent auto start
     */
    readonly autoLaunch2: number;
    /**
     * The absolute path of the `conf` directory of the current workspace
     */
    readonly confDir: string;
    /**
     * Kernel operating environment
     * - `docker`: Docker container
     * - `android`: Android device
     * - `ios`: iOS device
     * - `std`: Desktop Electron environment
     */
    readonly container: TSystemContainer;
    /**
     * The absolute path of the `data` directory of the current workspace
     */
    readonly dataDir: string;
    /**
     * List of disabled feature names
     */
    readonly disabledFeatures: string[];
    /**
     * Whether to automatically download the installation package for the new version
     */
    readonly downloadInstallPkg: boolean;
    /**
     * Whether to lock encrypted notebooks when the operating system locks the screen
     */
    readonly encryptedNotebookFollowSystemLock: boolean;
    /**
     * The absolute path of the user's home directory for the current operating system user
     */
    readonly homeDir: string;
    /**
     * Device ID (the machine ID on desktop, a random string in other environments)
     */
    readonly id: string;
    /**
     * Whether the current version is a Microsoft Store version
     */
    readonly isMicrosoftStore: boolean;
    /**
     * Kernel version number
     */
    readonly kernelVersion: string;
    /**
     * Lock screen mode
     * - `0`: Manual
     * - `1`: Manual + Follow the operating system
     */
    readonly lockScreenMode: number;
    /**
     * Whether the workspace has been added to the Microsoft Defender exclusions (also `true`
     * when the user ignored the prompt), Windows only
     */
    readonly microsoftDefenderExcluded: boolean;
    /**
     * The name of the current device
     */
    readonly name: string;
    readonly networkProxy: INetworkProxy;
    /**
     * Whether to enable network serve (whether to allow connections from other devices)
     */
    readonly networkServe: boolean;
    /**
     * Whether the network serve uses HTTPS (requires `networkServe`)
     */
    readonly networkServeTLS: boolean;
    /**
     * The operating system name determined at compile time
     * (obtained using the command `go tool dist list`)
     * - `android`: Android
     * - `darwin`: macOS
     * - `ios`: iOS
     * - `linux`: Linux
     * - `windows`: Windows
     */
    readonly os: TSystemOS;
    /**
     * Operating system platform name
     */
    readonly osPlatform: string;
    /**
     * Whether the kernel runs in safe mode
     */
    readonly safeMode: boolean;
    /**
     * Update channel
     */
    readonly updateChannel?: TSystemUpdateChannel;
    /**
     * The absolute path of the workspace directory
     */
    readonly workspaceDir: string;
}

/**
 * Kernel operating environment
 * - `docker`: Docker container
 * - `android`: Android device
 * - `ios`: iOS device
 * - `std`: Desktop Electron environment
 */
export type TSystemContainer = "android" | "docker" | "ios" | "std";

/**
 * SiYuan Network proxy configuration
 */
export interface INetworkProxy {
    /**
     * Host name or host address
     */
    readonly host: string;
    /**
     * Proxy server port number, an empty string when not set
     */
    readonly port: string;
    /**
     * The protocol used by the proxy server
     * - Empty String: Use the system proxy settings
     * - `http`: HTTP
     * - `https`: HTTPS
     * - `socks5`: SOCKS5
     */
    readonly scheme: TSystemNetworkProxyScheme;
}

/**
 * The protocol used by the proxy server
 * - Empty String: Use the system proxy settings
 * - `http`: HTTP
 * - `https`: HTTPS
 * - `socks5`: SOCKS5
 */
export type TSystemNetworkProxyScheme = "" | "http" | "https" | "socks5";

/**
 * The operating system name determined at compile time
 * (obtained using the command `go tool dist list`)
 * - `android`: Android
 * - `darwin`: macOS
 * - `ios`: iOS
 * - `linux`: Linux
 * - `windows`: Windows
 */
export type TSystemOS = "android" | "darwin" | "ios" | "linux" | "windows";

/**
 * Update channel
 */
export type TSystemUpdateChannel = "alpha" | "beta" | "stable";

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
    readonly sort: number;
}

/**
 * SiYuan UI layout related configuration
 */
export interface IUILayout {
    readonly bottom: IUILayoutDock;
    /**
     * Whether to hide the sidebar
     */
    readonly hideDock: boolean;
    readonly layout: IUILayoutLayout;
    readonly left: IUILayoutDock;
    readonly right: IUILayoutDock;
}

/**
 * SiYuan dock related configuration
 */
export interface IUILayoutDock {
    /**
     * Dock area list
     */
    readonly data: Array<IUILayoutDockTab[]>;
    /**
     * Whether to pin the dock
     */
    readonly pin: boolean;
}

/**
 * SiYuan dock tab data
 */
export interface IUILayoutDockTab {
    /**
     * Dock tab hotkey
     */
    readonly hotkey?: string;
    /**
     * Hotkey description ID
     */
    readonly hotkeyLangId?: string;
    /**
     * Tab icon ID
     */
    readonly icon: string;
    /**
     * Whether to display the tab
     */
    readonly show: boolean;
    readonly size: IUILayoutDockPanelSize;
    /**
     * Tab title
     */
    readonly title: string;
    /**
     * Tab type
     */
    readonly type: string;
}

/**
 * SiYuan dock tab size
 */
export interface IUILayoutDockPanelSize {
    /**
     * Tab height (unit: px)
     */
    readonly height: null | number;
    /**
     * Tab width (unit: px)
     */
    readonly width: null | number;
}

/**
 * SiYuan panel layout
 */
export interface IUILayoutLayout {
    /**
     * Internal elements
     */
    readonly children: IUILayoutLayoutChild[];
    /**
     * Panel content layout direction
     * - `tb`: Top and bottom layout
     * - `lr`: Left and right layout
     */
    readonly direction?: TUILayoutDirection;
    /**
     * Object name
     */
    readonly instance: "Layout";
    /**
     * The direction in which the size can be adjusted
     * - `tb`: Can adjust the size up and down
     * - `lr`: Can adjust the size left and right
     */
    readonly resize?: TUILayoutDirection;
    /**
     * Panel size
     */
    readonly size?: string;
    /**
     * Layout type
     * - `normal`: Normal panel
     * - `center`: Center panel
     * - `top`: Top panel
     * - `bottom`: Bottom panel
     * - `left`: Left panel
     * - `right`: Right panel
     */
    readonly type?: TUILayoutType;
}

/**
 * SiYuan panel layout
 *
 * SiYuan window layout
 */
export interface IUILayoutLayoutChild {
    /**
     * Internal elements
     */
    readonly children: IuiLayout[];
    /**
     * Panel content layout direction
     * - `tb`: Top and bottom layout
     * - `lr`: Left and right layout
     */
    readonly direction?: TUILayoutDirection;
    /**
     * Object name
     */
    readonly instance: FluffyTUILayout;
    /**
     * The direction in which the size can be adjusted
     * - `tb`: Can adjust the size up and down
     * - `lr`: Can adjust the size left and right
     */
    readonly resize?: TUILayoutDirection;
    /**
     * Panel size
     */
    readonly size?: string;
    /**
     * Layout type
     * - `normal`: Normal panel
     * - `center`: Center panel
     * - `top`: Top panel
     * - `bottom`: Bottom panel
     * - `left`: Left panel
     * - `right`: Right panel
     */
    readonly type?: TUILayoutType;
    /**
     * Panel height
     */
    readonly height?: string;
    /**
     * Panel width
     */
    readonly width?: string;
}

export type IUILayoutTabContent = IuiLayout[] | IuiLayoutTab;

/**
 * SiYuan panel layout
 *
 * SiYuan window layout
 *
 * SiYuan tab
 */
export interface IuiLayout {
    /**
     * Internal elements
     *
     * Tab content
     */
    readonly children: IUILayoutTabContent;
    /**
     * Panel content layout direction
     * - `tb`: Top and bottom layout
     * - `lr`: Left and right layout
     */
    readonly direction?: TUILayoutDirection;
    /**
     * Object name
     */
    readonly instance: PurpleTUILayout;
    /**
     * The direction in which the size can be adjusted
     * - `tb`: Can adjust the size up and down
     * - `lr`: Can adjust the size left and right
     */
    readonly resize?: TUILayoutDirection;
    /**
     * Panel size
     */
    readonly size?: string;
    /**
     * Layout type
     * - `normal`: Normal panel
     * - `center`: Center panel
     * - `top`: Top panel
     * - `bottom`: Bottom panel
     * - `left`: Left panel
     * - `right`: Right panel
     */
    readonly type?: TUILayoutType;
    /**
     * Panel height
     */
    readonly height?: string;
    /**
     * Panel width
     */
    readonly width?: string;
    /**
     * Whether the tab is active
     */
    readonly active?: boolean;
    /**
     * Tab activation time (Unix timestamp)
     */
    readonly activeTime?: string;
    /**
     * Tab icon
     */
    readonly docIcon?: string;
    /**
     * Icon reference ID
     */
    readonly icon?: string;
    /**
     * Localization field key name
     */
    readonly lang?: string;
    /**
     * Whether the tab is pinned
     */
    readonly pin?: boolean;
    /**
     * Tab title
     */
    readonly title?: string;
}

/**
 * SiYuan tab without content
 *
 * SiYuan editor tab
 *
 * SiYuan asset file tab
 *
 * SiYuan custom tab
 *
 * SiYuan back link tab
 *
 * SiYuan bookmark tab
 *
 * SiYuan filetree tab
 *
 * SiYuan graph tab
 *
 * SiYuan outline tab
 *
 * SiYuan tag tab
 *
 * SiYuan search tab
 */
export interface IuiLayoutTab {
    /**
     * (Editor) Actions to be performed after the tab is loaded
     */
    readonly action?: string;
    /**
     * (Editor) Block ID
     *
     * (Backlink) Block ID
     *
     * (Graph) Block ID
     *
     * (Outline) Block ID
     */
    readonly blockId?: string;
    /**
     * Object name
     */
    readonly instance?: TUILayoutTabContentInstance;
    /**
     * (Editor) Editor mode
     * - `wysiwyg`: WYSIWYG mode
     * - `preview`: Export preview mode
     */
    readonly mode?: TUILayoutTabEditorMode;
    /**
     * (Editor) Notebook ID
     */
    readonly notebookId?: string;
    /**
     * (Editor) Document block ID
     *
     * (Backlink) Document block ID
     *
     * (Graph) Document block ID
     */
    readonly rootId?: string;
    /**
     * (Asset) PDF file page number
     */
    readonly page?: number;
    /**
     * (Asset) Asset reference path
     */
    readonly path?: string;
    /**
     * (Custom) Data of the custom tab
     */
    readonly customModelData?: any;
    /**
     * (Custom) Type of the custom tab
     */
    readonly customModelType?: string;
    /**
     * (Backlink) Tab type
     * - `pin`: Pinned backlink panel
     * - `local`: The backlink panel of the current editor
     *
     * (Graph) Tab type
     * - `pin`: Pinned graph
     * - `local`: Graph of the current editor
     * - `global`: Global graph
     *
     * (Outline) Tab type
     * - `pin`: Pinned outline panel
     * - `local`: The outline panel of the current editor
     */
    readonly type?: TuiLayoutTabType;
    /**
     * (Outline) Whether the associated editor is in preview mode
     */
    readonly isPreview?: boolean;
    readonly config?: IUILayoutTabSearchConfig;
}

/**
 * SiYuan search tab configuration
 */
export interface IUILayoutTabSearchConfig {
    /**
     * Grouping strategy
     * - `0`: No grouping
     * - `1`: Group by document
     */
    readonly group: number;
    readonly hasReplace: any;
    /**
     * Readable path list
     */
    readonly hPath: string;
    /**
     * Search in the specified paths
     */
    readonly idPath: string[];
    /**
     * Search content
     */
    readonly k: string;
    /**
     * Search scheme
     * - `0`: Keyword (default)
     * - `1`: Query syntax
     * - `2`: SQL
     * - `3`: Regular expression
     * @defaultValue 0
     */
    readonly method: number;
    /**
     * Custom name of the query condition group
     */
    readonly name?: string;
    /**
     * Current page number
     */
    readonly page: number;
    /**
     * Replace content
     */
    readonly r: string;
    /**
     * Whether to clear the search box after removing the currently used query condition group
     */
    readonly removed?: boolean;
    readonly replaceTypes: IUILayoutTabSearchConfigReplaceTypes;
    /**
     * Search result sorting scheme
     * - `0`: Block type (default)
     * - `1`: Ascending by creation time
     * - `2`: Descending by creation time
     * - `3`: Ascending by update time
     * - `4`: Descending by update time
     * - `5`: By content order (only valid when grouping by document)
     * - `6`: Ascending by relevance
     * - `7`: Descending by relevance
     * @defaultValue 0
     */
    readonly sort: number;
    readonly types: IUILayoutTabSearchConfigTypes;
}

/**
 * Replace type filtering
 */
export interface IUILayoutTabSearchConfigReplaceTypes {
    /**
     * Replace hyperlinks
     * @defaultValue false
     */
    readonly aHref?: boolean;
    /**
     * Replace hyperlink anchor text
     * @defaultValue true
     */
    readonly aText?: boolean;
    /**
     * Replace hyperlink title
     * @defaultValue true
     */
    readonly aTitle?: boolean;
    /**
     * Replace inline code
     * @defaultValue false
     */
    readonly code?: boolean;
    /**
     * Replace code blocks
     * @defaultValue false
     */
    readonly codeBlock?: boolean;
    /**
     * Replace document title
     * @defaultValue true
     */
    readonly docTitle?: boolean;
    /**
     * Replace italic elements
     * @defaultValue true
     */
    readonly em?: boolean;
    /**
     * Replace HTML blocks
     * @defaultValue false
     */
    readonly htmlBlock?: boolean;
    /**
     * Replace image addresses
     * @defaultValue false
     */
    readonly imgSrc?: boolean;
    /**
     * Replace image anchor text
     * @defaultValue true
     */
    readonly imgText?: boolean;
    /**
     * Replace image titles
     * @defaultValue true
     */
    readonly imgTitle?: boolean;
    /**
     * Replace inline formulas
     * @defaultValue false
     */
    readonly inlineMath?: boolean;
    /**
     * Replace inline memos
     * @defaultValue true
     */
    readonly inlineMemo?: boolean;
    /**
     * Replace kdb elements
     * @defaultValue true
     */
    readonly kbd?: boolean;
    /**
     * Replace mark elements
     * @defaultValue true
     */
    readonly mark?: boolean;
    /**
     * Replace formula blocks
     * @defaultValue false
     */
    readonly mathBlock?: boolean;
    /**
     * Replace delete elements
     * @defaultValue true
     */
    readonly s?: boolean;
    /**
     * Replace bold elements
     * @defaultValue true
     */
    readonly strong?: boolean;
    /**
     * Replace subscript elements
     * @defaultValue true
     */
    readonly sub?: boolean;
    /**
     * Replace superscript elements
     * @defaultValue true
     */
    readonly sup?: boolean;
    /**
     * Replace tag elements
     * @defaultValue true
     */
    readonly tag?: boolean;
    /**
     * Replace rich text elements
     * @defaultValue true
     */
    readonly text?: boolean;
    /**
     * Replace underline elements
     * @defaultValue true
     */
    readonly u?: boolean;
}

/**
 * Search type filtering
 */
export interface IUILayoutTabSearchConfigTypes {
    /**
     * Search results contain audio blocks
     * @defaultValue false
     */
    readonly audioBlock?: boolean;
    /**
     * Search results contain blockquote blocks
     * @defaultValue false
     */
    readonly blockquote: boolean;
    /**
     * Search results contain code blocks
     * @defaultValue false
     */
    readonly codeBlock: boolean;
    /**
     * Search results contain database blocks
     * @defaultValue false
     */
    readonly databaseBlock: boolean;
    /**
     * Search results contain document blocks
     * @defaultValue false
     */
    readonly document: boolean;
    /**
     * Search results contain embed blocks
     * @defaultValue false
     */
    readonly embedBlock: boolean;
    /**
     * Search results contain heading blocks
     * @defaultValue false
     */
    readonly heading: boolean;
    /**
     * Search results contain html blocks
     * @defaultValue false
     */
    readonly htmlBlock: boolean;
    /**
     * Search results contain iframe blocks
     * @defaultValue false
     */
    readonly iframeBlock?: boolean;
    /**
     * Search results contain list blocks
     * @defaultValue false
     */
    readonly list: boolean;
    /**
     * Search results contain list item blocks
     * @defaultValue false
     */
    readonly listItem: boolean;
    /**
     * Search results contain math blocks
     * @defaultValue false
     */
    readonly mathBlock: boolean;
    /**
     * Search results contain paragraph blocks
     * @defaultValue false
     */
    readonly paragraph: boolean;
    /**
     * Search results contain super blocks
     * @defaultValue false
     */
    readonly superBlock: boolean;
    /**
     * Search results contain table blocks
     * @defaultValue false
     */
    readonly table: boolean;
    /**
     * Search results contain video blocks
     * @defaultValue false
     */
    readonly videoBlock?: boolean;
    /**
     * Search results contain widget blocks
     * @defaultValue false
     */
    readonly widgetBlock?: boolean;
}

export type TUILayoutTabContentInstance = "Asset" | "Backlink" | "Bookmark" | "Custom" | "Editor" | "Files" | "Graph" | "Outline" | "Search" | "Tag";

/**
 * (Editor) Editor mode
 * - `wysiwyg`: WYSIWYG mode
 * - `preview`: Export preview mode
 */
export type TUILayoutTabEditorMode = "preview" | "wysiwyg";

/**
 * (Backlink) Tab type
 * - `pin`: Pinned backlink panel
 * - `local`: The backlink panel of the current editor
 *
 * (Graph) Tab type
 * - `pin`: Pinned graph
 * - `local`: Graph of the current editor
 * - `global`: Global graph
 *
 * (Outline) Tab type
 * - `pin`: Pinned outline panel
 * - `local`: The outline panel of the current editor
 */
export type TuiLayoutTabType = "global" | "local" | "pin";

/**
 * Panel content layout direction
 * - `tb`: Top and bottom layout
 * - `lr`: Left and right layout
 *
 * The direction in which the size can be adjusted
 * - `tb`: Can adjust the size up and down
 * - `lr`: Can adjust the size left and right
 */
export type TUILayoutDirection = "lr" | "tb";

export type PurpleTUILayout = "Layout" | "Tab" | "Wnd";

/**
 * Layout type
 * - `normal`: Normal panel
 * - `center`: Center panel
 * - `top`: Top panel
 * - `bottom`: Bottom panel
 * - `left`: Left panel
 * - `right`: Right panel
 */
export type TUILayoutType = "bottom" | "center" | "left" | "normal" | "right" | "top";

export type FluffyTUILayout = "Layout" | "Wnd";

/**
 * Global variables
 */
export interface IVariables {
    /**
     * Variables, referenced as `{{vars.NAME}}` or `$NAME`
     */
    readonly items: IVariablesItem[];
}

/**
 * Variable
 */
export interface IVariablesItem {
    /**
     * Variable name
     */
    readonly name: string;
    /**
     * Variable value (stored in plain text)
     */
    readonly value: string;
}

// #endregion content
