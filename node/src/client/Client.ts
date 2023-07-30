import * as axios from "axios";
import * as ofetch from "ofetch";

// TODO: refactor
import fullTextSearchBlock from "@/types/kernel/api/search/fullTextSearchBlock";
import getBookmarkLabels from "@/types/kernel/api/attr/getBookmarkLabels";
import getConf from "@/types/kernel/api/system/getConf";
import getDocInfo from "@/types/kernel/api/block/getDocInfo";
import getRecentDocs from "@/types/kernel/api/storage/getRecentDocs";
import listDocsByPath from "@/types/kernel/api/filetree/listDocsByPath";
import searchDocs from "@/types/kernel/api/filetree/searchDocs";

import { kernel } from "@/types";

import constants from "@/constants";
import { HTTPError } from "@/errors/http";
import { KernelError } from "@/errors/kernel";

/* 基础设置选项 */
export interface IBaseOptions {
    /**
     * 思源服务 base URL
     * REF: https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/base
     */
    baseURL?: string,
    /**
     * 思源 API Token
     * REF: https://github.com/siyuan-note/siyuan/blob/master/API.md#Authentication
     */
    token?: string,
}

/* 扩展设置选项 */
export type ExtendOptions = ofetch.FetchOptions | axios.AxiosRequestConfig;

/* 完整设置选项 */
// export type IOptions = (IBaseOptions & axios.AxiosRequestConfig) | (IBaseOptions & ofetch.FetchOptions);
export type FetchOptions = IBaseOptions & ofetch.FetchOptions;
export type AxiosOptions = IBaseOptions & axios.AxiosRequestConfig;
export type Options = FetchOptions | AxiosOptions;

/* HTTP 请求客户端类型 */
export type ClientType = "fetch" | "xhr";

/* 响应类型 */
export type FetchResponseType =
    "arrayBuffer" |
    "blob" |
    "json" |
    "stream" |
    "text";
export type ResponseType = axios.ResponseType | FetchResponseType;

/* 全局设置选项 */
export type GlobalOptions = {
    type: "fetch",
    options: FetchOptions,
} | {
    type: "xhr",
    options: AxiosOptions,
};

/* 临时设置选项 */
export interface TempFetchOptions {
    type: "fetch",
    options?: ofetch.FetchOptions,
}
export interface TempAxiosOptions {
    type: "xhr",
    options?: axios.AxiosRequestConfig,
}
export type TempOptions = TempFetchOptions | TempAxiosOptions;

export class Client {
    public static readonly api = {
        // TODO: refactor
        search: {
            fullTextSearchBlock: { pathname: "/api/search/fullTextSearchBlock", method: "POST" },
        },
        storage: {
            getRecentDocs: { pathname: "/api/storage/getRecentDocs", method: "POST" },
        },

        asset: {
            upload: { pathname: "/api/asset/upload", method: "POST" },
        },
        attr: {
            getBlockAttrs: { pathname: "/api/attr/getBlockAttrs", method: "POST" },
            setBlockAttrs: { pathname: "/api/attr/setBlockAttrs", method: "POST" },

            // TODO: refactor
            getBookmarkLabels: { pathname: "/api/attr/getBookmarkLabels", method: "POST" },
        },
        block: {
            appendBlock: { pathname: "/api/block/appendBlock", method: "POST" },
            deleteBlock: { pathname: "/api/block/deleteBlock", method: "POST" },
            getBlockBreadcrumb: { pathname: "/api/block/getBlockBreadcrumb", method: "POST" },
            getBlockDOM: { pathname: "/api/block/getBlockDOM", method: "POST" },
            getBlockInfo: { pathname: "/api/block/getBlockInfo", method: "POST" },
            getBlockKramdown: { pathname: "/api/block/getBlockKramdown", method: "POST" },
            getChildBlocks: { pathname: "/api/block/getChildBlocks", method: "POST" },
            insertBlock: { pathname: "/api/block/insertBlock", method: "POST" },
            moveBlock: { pathname: "/api/block/moveBlock", method: "POST" },
            prependBlock: { pathname: "/api/block/prependBlock", method: "POST" },
            transferBlockRef: { pathname: "/api/block/transferBlockRef", method: "POST" },
            updateBlock: { pathname: "/api/block/updateBlock", method: "POST" },

            // TODO: refactor
            getDocInfo: { pathname: "/api/block/getDocInfo", method: "POST" },
        },
        convert: {
            pandoc: { pathname: "/api/convert/pandoc", method: "POST" },
        },
        export: {
            exportMdContent: { pathname: "/api/export/exportMdContent", method: "POST" },
            exportResources: { pathname: "/api/export/exportResources", method: "POST" },
        },
        file: {
            getFile: { pathname: "/api/file/getFile", method: "POST" },
            putFile: { pathname: "/api/file/putFile", method: "POST" },
            readDir: { pathname: "/api/file/readDir", method: "POST" },
            removeFile: { pathname: "/api/file/removeFile", method: "POST" },
            renameFile: { pathname: "/api/file/renameFile", method: "POST" },
        },
        filetree: {
            createDocWithMd: { pathname: "/api/filetree/createDocWithMd", method: "POST" },
            getDoc: { pathname: "/api/filetree/getDoc", method: "POST" },
            getHPathByID: { pathname: "/api/filetree/getHPathByID", method: "POST" },
            getHPathByPath: { pathname: "/api/filetree/getHPathByPath", method: "POST" },
            moveDocs: { pathname: "/api/filetree/moveDocs", method: "POST" },
            removeDoc: { pathname: "/api/filetree/removeDoc", method: "POST" },
            renameDoc: { pathname: "/api/filetree/renameDoc", method: "POST" },

            // TODO: refactor
            listDocsByPath: { pathname: "/api/filetree/listDocsByPath", method: "POST" },
            searchDocs: { pathname: "/api/filetree/searchDocs", method: "POST" },
        },
        history: {
            getDocHistoryContent: { pathname: "/api/history/getDocHistoryContent", method: "POST" },
            getHistoryItems: { pathname: "/api/history/getHistoryItems", method: "POST" },
        },
        inbox: {
            getShorthand: { pathname: "/api/inbox/getShorthand", method: "POST" },
        },
        network: {
            forwardProxy: { pathname: "/api/network/forwardProxy", method: "POST" },
        },
        notebook: {
            closeNotebook: { pathname: "/api/notebook/closeNotebook", method: "POST" },
            createNotebook: { pathname: "/api/notebook/createNotebook", method: "POST" },
            lsNotebooks: { pathname: "/api/notebook/lsNotebooks", method: "POST" },
            getNotebookConf: { pathname: "/api/notebook/getNotebookConf", method: "POST" },
            openNotebook: { pathname: "/api/notebook/openNotebook", method: "POST" },
            removeNotebook: { pathname: "/api/notebook/removeNotebook", method: "POST" },
            renameNotebook: { pathname: "/api/notebook/renameNotebook", method: "POST" },
            setNotebookConf: { pathname: "/api/notebook/setNotebookConf", method: "POST" },
        },
        notification: {
            pushErrMsg: { pathname: "/api/notification/pushErrMsg", method: "POST" },
            pushMsg: { pathname: "/api/notification/pushMsg", method: "POST" },
        },
        query: {
            sql: { pathname: "/api/query/sql", method: "POST" },
        },
        repo: {
            openRepoSnapshotDoc: { pathname: "/api/repo/openRepoSnapshotDoc", method: "POST" },
        },
        snippet: {
            getSnippet: { pathname: "/api/snippet/getSnippet", method: "POST" },
            setSnippet: { pathname: "/api/snippet/setSnippet", method: "POST" },
        },
        system: {
            bootProgress: { pathname: "/api/system/bootProgress", method: "POST" },
            currentTime: { pathname: "/api/system/currentTime", method: "POST" },
            version: { pathname: "/api/system/version", method: "POST" },

            // TODO: refactor
            getConf: { pathname: "/api/system/getConf", method: "POST" },
        },
        template: {
            render: { pathname: "/api/template/render", method: "POST" },
            renderSprig: { pathname: "/api/template/renderSprig", method: "POST" },
        },
    } as const;

    protected _type: ClientType = "xhr";

    protected _baseURL: string = globalThis.document?.baseURI
        ?? globalThis.location?.origin
        ?? constants.SIYUAN_DEFAULT_BASE_URL;

    protected _token: string = constants.SIYUAN_DEFAULT_TOKEN;

    public _axios = axios.default.create({
        baseURL: this._baseURL,
        timeout: constants.REQUEST_TIMEOUT,
        headers: {
            Authorization: `Token ${this._token}`,
        },
    });

    public _fetch = ofetch.ofetch.create({
        baseURL: this._baseURL,
        headers: {
            Authorization: `Token ${this._token}`,
        },
    });

    constructor(
        options: FetchOptions,
        type?: Extract<ClientType, "fetch">,
    );
    constructor(
        options: AxiosOptions,
        type?: Extract<ClientType, "xhr">,
    );
    constructor(
        options: Options = {}, // 全局设置选项
        type: ClientType = "xhr", // HTTP 请求客户端类型
    ) {
        this._setClientType(type);
        // @ts-ignore
        this._updateOptions(options, type);
    }

    /* 设置默认使用的客户端类型 */
    public _setClientType(type: ClientType): void {
        this._type = type;
    }

    /* 更新配置 */
    public _updateOptions(
        options: FetchOptions,
        type: Extract<ClientType, "fetch">,
    ): void;
    public _updateOptions(
        options: AxiosOptions,
        type: Extract<ClientType, "xhr">,
    ): void;
    public _updateOptions(
        options: Options,
        type: ClientType = this._type,
    ): void {
        this._token = options.token ?? this._token;
        switch (type) {
            case "fetch":
                const ofetch_options = options as FetchOptions;
                if (ofetch_options.token) {
                    const header_name = "Authorization";
                    const header_value = `Token ${options.token}`;
                    if (Array.isArray(ofetch_options.headers)) {
                        ofetch_options.headers.push([
                            header_name,
                            header_value,
                        ]);
                    }
                    else if (ofetch_options.headers instanceof Headers) {
                        ofetch_options.headers.set(
                            header_name,
                            header_value,
                        );
                    }
                    else if (typeof ofetch_options.headers === "object") {
                        ofetch_options.headers[header_name] = header_value;
                    }
                    else {
                        ofetch_options.headers = {
                            [header_name]: header_value,
                        };
                    }
                    delete options.token;
                }
                this._fetch = this._fetch.create(ofetch_options);
                break;
            case "xhr":
            default:
                for (const [key, value] of Object.entries(options)) {
                    switch (key) {
                        case "token":
                            this._axios.defaults.headers.Authorization = `Token ${options.token}`;
                            break;
                        default:
                            this._axios.defaults[key as keyof axios.AxiosRequestConfig] = value;
                            break;
                    }
                }
                break;
        }
        this._baseURL = options.baseURL ?? this._baseURL;
    }

    /* 获取所有书签 */
    public async getBookmarkLabels(
        config?: TempOptions,
    ): Promise<getBookmarkLabels.IResponse> {
        const response = await this._request(
            Client.api.attr.getBookmarkLabels.pathname,
            Client.api.attr.getBookmarkLabels.method,
            undefined,
            config,
        ) as getBookmarkLabels.IResponse;
        return response;
    }

    /* 获得指定块所在文档信息 */
    public async getDocInfo(
        payload: getDocInfo.IPayload,
        config?: TempOptions,
    ): Promise<getDocInfo.IResponse> {
        const response = await this._request(
            Client.api.block.getDocInfo.pathname,
            Client.api.block.getDocInfo.method,
            payload,
            config,
        ) as getDocInfo.IResponse;
        return response;
    }

    /* 查询子文档 */
    public async listDocsByPath(
        payload: listDocsByPath.IPayload,
        config?: TempOptions,
    ): Promise<listDocsByPath.IResponse> {
        const response = await this._request(
            Client.api.filetree.listDocsByPath.pathname,
            Client.api.filetree.listDocsByPath.method,
            payload,
            config,
        ) as listDocsByPath.IResponse;
        return response;
    }

    /* 搜索文档 */
    public async searchDocs(
        payload: searchDocs.IPayload,
        config?: TempOptions,
    ): Promise<searchDocs.IResponse> {
        const response = await this._request(
            Client.api.filetree.searchDocs.pathname,
            Client.api.filetree.searchDocs.method,
            payload,
            config,
        ) as searchDocs.IResponse;
        return response;
    }

    /* 全局搜索 */
    public async fullTextSearchBlock(
        payload: fullTextSearchBlock.IPayload,
        config?: TempOptions,
    ): Promise<fullTextSearchBlock.IResponse> {
        const response = await this._request(
            Client.api.search.fullTextSearchBlock.pathname,
            Client.api.search.fullTextSearchBlock.method,
            payload,
            config,
        ) as fullTextSearchBlock.IResponse;
        return response;
    }

    /* 查询最近打开的文档 */
    public async getRecentDocs(
        config?: TempOptions,
    ): Promise<getRecentDocs.IResponse> {
        const response = await this._request(
            Client.api.storage.getRecentDocs.pathname,
            Client.api.storage.getRecentDocs.method,
            undefined,
            config,
        ) as getRecentDocs.IResponse;
        return response;
    }

    /* 获得配置 */
    public async getConf(
        config?: TempOptions,
    ): Promise<getConf.IResponse> {
        const response = await this._request(
            Client.api.system.getConf.pathname,
            Client.api.system.getConf.method,
            undefined,
            config,
        ) as getConf.IResponse;
        return response;
    }

    /* 👇 由 JSON Schema 生成的类型定义👇 */
    /* 上传资源文件 */
    public async upload(
        payload: kernel.api.asset.upload.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.asset.upload.IResponse> {
        const formdata = new FormData();
        formdata.append("assetsDirPath", payload.assetsDirPath ?? "/assets/");
        payload.files.forEach(file => formdata.append("file[]", file));

        const response = await this._request(
            Client.api.asset.upload.pathname,
            Client.api.asset.upload.method,
            formdata,
            config,
        ) as kernel.api.asset.upload.IResponse;
        return response;
    }

    /* 获取块属性 */
    public async getBlockAttrs(
        payload: kernel.api.attr.getBlockAttrs.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.attr.getBlockAttrs.IResponse> {
        const response = await this._request(
            Client.api.attr.getBlockAttrs.pathname,
            Client.api.attr.getBlockAttrs.method,
            payload,
            config,
        ) as kernel.api.attr.getBlockAttrs.IResponse;
        return response;
    }

    /* 设置块属性 */
    public async setBlockAttrs(
        payload: kernel.api.attr.setBlockAttrs.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.attr.setBlockAttrs.IResponse> {
        const response = await this._request(
            Client.api.attr.setBlockAttrs.pathname,
            Client.api.attr.setBlockAttrs.method,
            payload,
            config,
        ) as kernel.api.attr.setBlockAttrs.IResponse;
        return response;
    }

    /* 在下级块尾部插入块 */
    public async appendBlock(
        payload: kernel.api.block.appendBlock.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.appendBlock.IResponse> {
        const response = await this._request(
            Client.api.block.appendBlock.pathname,
            Client.api.block.appendBlock.method,
            payload,
            config,
        ) as kernel.api.block.appendBlock.IResponse;
        return response;
    }

    /* 删除块 */
    public async deleteBlock(
        payload: kernel.api.block.deleteBlock.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.deleteBlock.IResponse> {
        const response = await this._request(
            Client.api.block.deleteBlock.pathname,
            Client.api.block.deleteBlock.method,
            payload,
            config,
        ) as kernel.api.block.deleteBlock.IResponse;
        return response;
    }

    /* 获得块面包屑 */
    public async getBlockBreadcrumb(
        payload: kernel.api.block.getBlockBreadcrumb.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.getBlockBreadcrumb.IResponse> {
        const response = await this._request(
            Client.api.block.getBlockBreadcrumb.pathname,
            Client.api.block.getBlockBreadcrumb.method,
            payload,
            config,
        ) as kernel.api.block.getBlockBreadcrumb.IResponse;
        return response;
    }

    /* 获得块的 DOM */
    public async getBlockDOM(
        payload: kernel.api.block.getBlockDOM.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.getBlockDOM.IResponse> {
        const response = await this._request(
            Client.api.block.getBlockDOM.pathname,
            Client.api.block.getBlockDOM.method,
            payload,
            config,
        ) as kernel.api.block.getBlockDOM.IResponse;
        return response;
    }

    /* 获得块所在文档的信息 */
    public async getBlockInfo(
        payload: kernel.api.block.getBlockInfo.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.getBlockInfo.IResponse> {
        const response = await this._request(
            Client.api.block.getBlockInfo.pathname,
            Client.api.block.getBlockInfo.method,
            payload,
            config,
        ) as kernel.api.block.getBlockInfo.IResponse;
        return response;
    }

    /* 获得块的 kramdown 源码 */
    public async getBlockKramdown(
        payload: kernel.api.block.getBlockKramdown.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.getBlockKramdown.IResponse> {
        const response = await this._request(
            Client.api.block.getBlockKramdown.pathname,
            Client.api.block.getBlockKramdown.method,
            payload,
            config,
        ) as kernel.api.block.getBlockKramdown.IResponse;
        return response;
    }

    /* 获得指定块的所有下级块 */
    public async getChildBlocks(
        payload: kernel.api.block.getChildBlocks.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.getChildBlocks.IResponse> {
        const response = await this._request(
            Client.api.block.getChildBlocks.pathname,
            Client.api.block.getChildBlocks.method,
            payload,
            config,
        ) as kernel.api.block.getChildBlocks.IResponse;
        return response;
    }

    /* 插入块 */
    public async insertBlock(
        payload: kernel.api.block.insertBlock.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.insertBlock.IResponse> {
        const response = await this._request(
            Client.api.block.insertBlock.pathname,
            Client.api.block.insertBlock.method,
            payload,
            config,
        ) as kernel.api.block.insertBlock.IResponse;
        return response;
    }

    /* 移动块 */
    public async moveBlock(
        payload: kernel.api.block.moveBlock.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.moveBlock.IResponse> {
        const response = await this._request(
            Client.api.block.moveBlock.pathname,
            Client.api.block.moveBlock.method,
            payload,
            config,
        ) as kernel.api.block.moveBlock.IResponse;
        return response;
    }

    /* 在下级块首部插入块 */
    public async prependBlock(
        payload: kernel.api.block.prependBlock.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.prependBlock.IResponse> {
        const response = await this._request(
            Client.api.block.prependBlock.pathname,
            Client.api.block.prependBlock.method,
            payload,
            config,
        ) as kernel.api.block.prependBlock.IResponse;
        return response;
    }

    /* 转移块引用 */
    public async transferBlockRef(
        payload: kernel.api.block.transferBlockRef.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.transferBlockRef.IResponse> {
        const response = await this._request(
            Client.api.block.transferBlockRef.pathname,
            Client.api.block.transferBlockRef.method,
            payload,
            config,
        ) as kernel.api.block.transferBlockRef.IResponse;
        return response;
    }

    /* 更新块 */
    public async updateBlock(
        payload: kernel.api.block.updateBlock.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.updateBlock.IResponse> {
        const response = await this._request(
            Client.api.block.updateBlock.pathname,
            Client.api.block.updateBlock.method,
            payload,
            config,
        ) as kernel.api.block.updateBlock.IResponse;
        return response;
    }

    /* 调用 pandoc 转换转换文件 */
    public async pandoc(
        payload: kernel.api.convert.pandoc.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.convert.pandoc.IResponse> {
        const response = await this._request(
            Client.api.convert.pandoc.pathname,
            Client.api.convert.pandoc.method,
            payload,
            config,
        ) as kernel.api.convert.pandoc.IResponse;
        return response;
    }

    /* 打包文件与文件夹以导出 */
    public async exportResources(
        payload: kernel.api.export.exportResources.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.export.exportResources.IResponse> {
        const response = await this._request(
            Client.api.export.exportResources.pathname,
            Client.api.export.exportResources.method,
            payload,
            config,
        ) as kernel.api.export.exportResources.IResponse;
        return response;
    }

    /* 导出指定文档块为 Markdown */
    public async exportMdContent(
        payload: kernel.api.export.exportMdContent.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.export.exportMdContent.IResponse> {
        const response = await this._request(
            Client.api.export.exportMdContent.pathname,
            Client.api.export.exportMdContent.method,
            payload,
            config,
        ) as kernel.api.export.exportMdContent.IResponse;
        return response;
    }

    /* 获取文件 */
    public async getFile(
        payload: kernel.api.file.getFile.IPayload,
        responseType: ResponseType = "text",
        config?: TempOptions,
    ): Promise<unknown> {
        const response = await this._request(
            Client.api.file.getFile.pathname,
            Client.api.file.getFile.method,
            payload,
            config,
            false,
            responseType,
        );
        return response;
    }

    /* 设置文件 */
    public async putFile(
        payload: kernel.api.file.putFile.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.file.putFile.IResponse> {
        /**
         * 若文件不是 File 类型，则转换为 File 类型
         * REF: https://developer.mozilla.org/zh-CN/docs/Web/API/File/File
         */
        if (payload.file !== undefined && !(payload.file instanceof File)) {
            payload.file = new File(
                [payload.file],
                payload.path.split("/").pop()!,
            );
        }

        // REF: https://axios-http.com/zh/docs/post_example
        const formdata = new FormData();
        for (const [key, value] of Object.entries(payload)) {
            if (payload.hasOwnProperty(key)) {
                if (value instanceof Blob) {
                    formdata.append(key, value);
                }
                else {
                    formdata.append(key, String(value));
                }
            }
        }

        const response = await this._request(
            Client.api.file.putFile.pathname,
            Client.api.file.putFile.method,
            formdata,
            config,
        ) as kernel.api.file.putFile.IResponse;
        return response;
    }

    /* 获取文件目录下级内容 */
    public async readDir(
        payload: kernel.api.file.readDir.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.file.readDir.IResponse> {
        const response = await this._request(
            Client.api.file.readDir.pathname,
            Client.api.file.readDir.method,
            payload,
            config,
        ) as kernel.api.file.readDir.IResponse;
        return response;
    }

    /* 删除文件/目录 */
    public async removeFile(
        payload: kernel.api.file.removeFile.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.file.removeFile.IResponse> {
        const response = await this._request(
            Client.api.file.removeFile.pathname,
            Client.api.file.removeFile.method,
            payload,
            config,
        ) as kernel.api.file.removeFile.IResponse;
        return response;
    }

    /* 重命名/移动文件/目录 */
    public async renameFile(
        payload: kernel.api.file.renameFile.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.file.renameFile.IResponse> {
        const response = await this._request(
            Client.api.file.renameFile.pathname,
            Client.api.file.renameFile.method,
            payload,
            config,
        ) as kernel.api.file.renameFile.IResponse;
        return response;
    }

    /* 通过 Markdown 创建文档 */
    public async createDocWithMd(
        payload: kernel.api.filetree.createDocWithMd.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.filetree.createDocWithMd.IResponse> {
        const response = await this._request(
            Client.api.filetree.createDocWithMd.pathname,
            Client.api.filetree.createDocWithMd.method,
            payload,
            config,
        ) as kernel.api.filetree.createDocWithMd.IResponse;
        return response;
    }

    /* 获取文档内容 */
    public async getDoc(
        payload: kernel.api.filetree.getDoc.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.filetree.getDoc.IResponse> {
        const response = await this._request(
            Client.api.filetree.getDoc.pathname,
            Client.api.filetree.getDoc.method,
            payload,
            config,
        ) as kernel.api.filetree.getDoc.IResponse;
        return response;
    }

    /* 根据 ID 获取人类可读路径 */
    public async getHPathByID(
        payload: kernel.api.filetree.getHPathByID.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.filetree.getHPathByID.IResponse> {
        const response = await this._request(
            Client.api.filetree.getHPathByID.pathname,
            Client.api.filetree.getHPathByID.method,
            payload,
            config,
        ) as kernel.api.filetree.getHPathByID.IResponse;
        return response;
    }

    /* 根据路径获取人类可读路径 */
    public async getHPathByPath(
        payload: kernel.api.filetree.getHPathByPath.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.filetree.getHPathByPath.IResponse> {
        const response = await this._request(
            Client.api.filetree.getHPathByPath.pathname,
            Client.api.filetree.getHPathByPath.method,
            payload,
            config,
        ) as kernel.api.filetree.getHPathByPath.IResponse;
        return response;
    }

    /* 批量移动文档 */
    public async moveDocs(
        payload: kernel.api.filetree.moveDocs.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.filetree.moveDocs.IResponse> {
        const response = await this._request(
            Client.api.filetree.moveDocs.pathname,
            Client.api.filetree.moveDocs.method,
            payload,
            config,
        ) as kernel.api.filetree.moveDocs.IResponse;
        return response;
    }

    /* 删除文档 */
    public async removeDoc(
        payload: kernel.api.filetree.removeDoc.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.filetree.removeDoc.IResponse> {
        const response = await this._request(
            Client.api.filetree.removeDoc.pathname,
            Client.api.filetree.removeDoc.method,
            payload,
            config,
        ) as kernel.api.filetree.removeDoc.IResponse;
        return response;
    }

    /* 文档重命名 */
    public async renameDoc(
        payload: kernel.api.filetree.renameDoc.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.filetree.renameDoc.IResponse> {
        const response = await this._request(
            Client.api.filetree.renameDoc.pathname,
            Client.api.filetree.renameDoc.method,
            payload,
            config,
        ) as kernel.api.filetree.renameDoc.IResponse;
        return response;
    }

    /* 获取历史文档内容 */
    public async getDocHistoryContent(
        payload: kernel.api.history.getDocHistoryContent.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.history.getDocHistoryContent.IResponse> {
        const response = await this._request(
            Client.api.history.getDocHistoryContent.pathname,
            Client.api.history.getDocHistoryContent.method,
            payload,
            config,
        ) as kernel.api.history.getDocHistoryContent.IResponse;
        return response;
    }

    /* 查询历史项 */
    public async getHistoryItems(
        payload: kernel.api.history.getHistoryItems.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.history.getHistoryItems.IResponse> {
        const response = await this._request(
            Client.api.history.getHistoryItems.pathname,
            Client.api.history.getHistoryItems.method,
            payload,
            config,
        ) as kernel.api.history.getHistoryItems.IResponse;
        return response;
    }

    /* 收集箱速记内容 */
    public async getShorthand(
        payload: kernel.api.inbox.getShorthand.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.inbox.getShorthand.IResponse> {
        const response = await this._request(
            Client.api.inbox.getShorthand.pathname,
            Client.api.inbox.getShorthand.method,
            payload,
            config,
        ) as kernel.api.inbox.getShorthand.IResponse;
        return response;
    }

    /* 正向代理 */
    public async forwardProxy(
        payload: kernel.api.network.forwardProxy.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.network.forwardProxy.IResponse> {
        const response = await this._request(
            Client.api.network.forwardProxy.pathname,
            Client.api.network.forwardProxy.method,
            payload,
            config,
        ) as kernel.api.network.forwardProxy.IResponse;
        return response;
    }

    /* 关闭笔记本 */
    public async closeNotebook(
        payload: kernel.api.notebook.closeNotebook.IPayload,
        config?: TempOptions
    ): Promise<kernel.api.notebook.closeNotebook.IResponse> {
        const response = await this._request(
            Client.api.notebook.closeNotebook.pathname,
            Client.api.notebook.closeNotebook.method,
            payload,
            config,
        ) as kernel.api.notebook.closeNotebook.IResponse;
        return response;
    }

    /* 创建笔记本 */
    public async createNotebook(
        payload: kernel.api.notebook.createNotebook.IPayload,
        config?: TempOptions
    ): Promise<kernel.api.notebook.createNotebook.IResponse> {
        const response = await this._request(
            Client.api.notebook.createNotebook.pathname,
            Client.api.notebook.createNotebook.method,
            payload,
            config,
        ) as kernel.api.notebook.createNotebook.IResponse;
        return response;
    }

    /* 获取笔记本配置信息 */
    public async getNotebookConf(
        payload: kernel.api.notebook.getNotebookConf.IPayload,
        config?: TempOptions
    ): Promise<kernel.api.notebook.getNotebookConf.IResponse> {
        const response = await this._request(
            Client.api.notebook.getNotebookConf.pathname,
            Client.api.notebook.getNotebookConf.method,
            payload,
            config,
        ) as kernel.api.notebook.getNotebookConf.IResponse;
        return response;
    }

    /* 列出笔记本信息 */
    public async lsNotebooks(
        config?: TempOptions,
    ): Promise<kernel.api.notebook.lsNotebooks.IResponse> {
        const response = await this._request(
            Client.api.notebook.lsNotebooks.pathname,
            Client.api.notebook.lsNotebooks.method,
            undefined,
            config,
        ) as kernel.api.notebook.lsNotebooks.IResponse;
        return response;
    }

    /* 打开笔记本 */
    public async openNotebook(
        payload: kernel.api.notebook.openNotebook.IPayload,
        config?: TempOptions
    ): Promise<kernel.api.notebook.openNotebook.IResponse> {
        const response = await this._request(
            Client.api.notebook.openNotebook.pathname,
            Client.api.notebook.openNotebook.method,
            payload,
            config,
        ) as kernel.api.notebook.openNotebook.IResponse;
        return response;
    }

    /* 删除笔记本 */
    public async removeNotebook(
        payload: kernel.api.notebook.removeNotebook.IPayload,
        config?: TempOptions
    ): Promise<kernel.api.notebook.removeNotebook.IResponse> {
        const response = await this._request(
            Client.api.notebook.removeNotebook.pathname,
            Client.api.notebook.removeNotebook.method,
            payload,
            config,
        ) as kernel.api.notebook.removeNotebook.IResponse;
        return response;
    }

    /* 重命名笔记本 */
    public async renameNotebook(
        payload: kernel.api.notebook.renameNotebook.IPayload,
        config?: TempOptions
    ): Promise<kernel.api.notebook.renameNotebook.IResponse> {
        const response = await this._request(
            Client.api.notebook.renameNotebook.pathname,
            Client.api.notebook.renameNotebook.method,
            payload,
            config,
        ) as kernel.api.notebook.renameNotebook.IResponse;
        return response;
    }

    /* 设置笔记本配置 */
    public async setNotebookConf(
        payload: kernel.api.notebook.setNotebookConf.IPayload,
        config?: TempOptions
    ): Promise<kernel.api.notebook.setNotebookConf.IResponse> {
        const response = await this._request(
            Client.api.notebook.setNotebookConf.pathname,
            Client.api.notebook.setNotebookConf.method,
            payload,
            config,
        ) as kernel.api.notebook.setNotebookConf.IResponse;
        return response;
    }

    /* 推送错误消息 */
    public async pushErrMsg(
        payload: kernel.api.notification.pushErrMsg.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.notification.pushErrMsg.IResponse> {
        const response = await this._request(
            Client.api.notification.pushErrMsg.pathname,
            Client.api.notification.pushErrMsg.method,
            payload,
            config,
        ) as kernel.api.notification.pushErrMsg.IResponse;
        return response;
    }

    /* 推送提示消息 */
    public async pushMsg(
        payload: kernel.api.notification.pushMsg.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.notification.pushMsg.IResponse> {
        const response = await this._request(
            Client.api.notification.pushMsg.pathname,
            Client.api.notification.pushMsg.method,
            payload,
            config,
        ) as kernel.api.notification.pushMsg.IResponse;
        return response;
    }

    /* SQL 查询 */
    public async sql(
        payload: kernel.api.query.sql.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.query.sql.IResponse> {
        const response = await this._request(
            Client.api.query.sql.pathname,
            Client.api.query.sql.method,
            payload,
            config,
        ) as kernel.api.query.sql.IResponse;
        return response;
    }

    /* 读取快照文件内容 */
    public async openRepoSnapshotDoc(
        payload: kernel.api.repo.openRepoSnapshotDoc.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.repo.openRepoSnapshotDoc.IResponse> {
        const response = await this._request(
            Client.api.repo.openRepoSnapshotDoc.pathname,
            Client.api.repo.openRepoSnapshotDoc.method,
            payload,
            config,
        ) as kernel.api.repo.openRepoSnapshotDoc.IResponse;
        return response;
    }

    /* 获取代码片段 */
    public async getSnippet(
        payload: kernel.api.snippet.getSnippet.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.snippet.getSnippet.IResponse> {
        const response = await this._request(
            Client.api.snippet.getSnippet.pathname,
            Client.api.snippet.getSnippet.method,
            payload,
            config,
        ) as kernel.api.snippet.getSnippet.IResponse;
        return response;
    }

    /* 设置代码片段 */
    public async setSnippet(
        payload: kernel.api.snippet.setSnippet.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.snippet.setSnippet.IResponse> {
        const response = await this._request(
            Client.api.snippet.setSnippet.pathname,
            Client.api.snippet.setSnippet.method,
            payload,
            config,
        ) as kernel.api.snippet.setSnippet.IResponse;
        return response;
    }

    /* 获取内核启动进度 */
    public async bootProgress(
        config?: TempOptions,
    ): Promise<kernel.api.system.bootProgress.IResponse> {
        const response = await this._request(
            Client.api.system.bootProgress.pathname,
            Client.api.system.bootProgress.method,
            undefined,
            config,
        ) as kernel.api.system.bootProgress.IResponse;
        return response;
    }

    /* 获得内核 Unix 时间戳 (单位: ms) */
    public async currentTime(
        config?: TempOptions,
    ): Promise<kernel.api.system.currentTime.IResponse> {
        const response = await this._request(
            Client.api.system.currentTime.pathname,
            Client.api.system.currentTime.method,
            undefined,
            config,
        ) as kernel.api.system.currentTime.IResponse;
        return response;
    }

    /* 获得内核版本 */
    public async version(
        config?: TempOptions,
    ): Promise<kernel.api.system.version.IResponse> {
        const response = await this._request(
            Client.api.system.version.pathname,
            Client.api.system.version.method,
            undefined,
            config,
        ) as kernel.api.system.version.IResponse;
        return response;
    }

    /* 渲染 kramdown 模板文件 */
    public async render(
        payload: kernel.api.template.render.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.template.render.IResponse> {
        const response = await this._request(
            Client.api.template.render.pathname,
            Client.api.template.render.method,
            payload,
            config,
        ) as kernel.api.template.render.IResponse;
        return response;
    }

    /* 渲染 Sprig 模板 */
    public async renderSprig(
        payload: kernel.api.template.renderSprig.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.template.renderSprig.IResponse> {
        const response = await this._request(
            Client.api.template.renderSprig.pathname,
            Client.api.template.renderSprig.method,
            payload,
            config,
        ) as kernel.api.template.renderSprig.IResponse;
        return response;
    }

    public async _request<P extends kernel.kernel.IPayload, R>(
        pathname: string,
        method: string,
        payload?: P,
        config?: TempOptions,
        normal: boolean = true,
        responseType: ResponseType = "json",
    ): Promise<R> {
        try {
            switch (config?.type ?? this._type) {
                case "fetch": {
                    const options = config?.options as FetchOptions | undefined;
                    responseType = (() => {
                        switch (responseType) {
                            case "arraybuffer":
                                return "arrayBuffer";
                            case "document":
                                return "text";
                            default:
                                return responseType;
                        }
                    })();
                    const response = await this._fetch<R, FetchResponseType>(
                        pathname,
                        {
                            method,
                            body: payload,
                            responseType,
                            ...options,
                        },
                    );
                    if (normal && responseType === "json" && typeof response === "object") {
                        return this._parseFetchResponse(response as kernel.kernel.IResponse) as R;
                    }
                    else {
                        return response as R;
                    }
                }
                case "xhr":
                default: {
                    const options = config?.options as AxiosOptions | undefined;
                    responseType = (() => {
                        switch (responseType) {
                            case "arrayBuffer":
                                return "arraybuffer";
                            default:
                                return responseType;
                        }
                    })();
                    const response = await this._axios.request<R>({
                        url: pathname,
                        method,
                        data: payload,
                        responseType,
                        ...options,
                    });
                    if (response.status === axios.HttpStatusCode.Ok) {
                        if (normal && responseType === "json" && typeof response.data === "object") {
                            return this._parseAxiosResponse(response as axios.AxiosResponse<kernel.kernel.IResponse>) as R;
                        }
                        else {
                            return response.data;
                        }
                    }
                    else { // HTTP 请求异常
                        const error = new HTTPError(response);
                        throw error;
                    }
                }
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * 解析内核响应
     */
    protected _parseFetchResponse<T extends kernel.kernel.IResponse>(response: T): T {
        if (response.code === 0) { // 内核正常响应
            return response;
        }
        else { // 内核异常响应
            const error = new KernelError(response);
            throw error;
        }
    }

    /**
     * 解析内核响应
     */
    protected _parseAxiosResponse<T extends kernel.kernel.IResponse>(response: axios.AxiosResponse<T>): T {
        if (response.data.code === 0) { // 内核正常响应
            return response.data;
        }
        else { // 内核异常响应
            const error = new KernelError(response.data, response);
            throw error;
        }
    }
}
