import fullTextSearchBlock from "@/types/kernel/api/search/fullTextSearchBlock";
import getBlockAttrs from "@/types/kernel/api/attr/getBlockAttrs";
import getBlockBreadcrumb from "@/types/kernel/api/block/getBlockBreadcrumb";
import getBookmarkLabels from "@/types/kernel/api/attr/getBookmarkLabels";
import getConf from "@/types/kernel/api/system/getConf";
import getDocInfo from "@/types/kernel/api/block/getDocInfo";
import getRecentDocs from "@/types/kernel/api/storage/getRecentDocs";
import listDocsByPath from "@/types/kernel/api/filetree/listDocsByPath";
import lsNotebooks from "@/types/kernel/api/notebook/lsNotebooks";
import renameDoc from "@/types/kernel/api/filetree/renameDoc";
import searchDocs from "@/types/kernel/api/filetree/searchDocs";
import setBlockAttrs from "@/types/kernel/api/attr/setBlockAttrs";
import kernel from "@/types/kernel";
import sql from "@/types/kernel/api/query/sql";
import version from "@/types/kernel/api/system/version";
import currentTime from "@/types/kernel/api/system/currentTime";

import constants from "@/constants";
import { HTTPError } from "@/errors/http";
import { KernelError } from "../errors/kernel";


export interface IOptions {
    url?: URL,
    token?: string,
    timeout?: number,
}

export class Client {
    public static readonly api = {
        attr: {
            getBlockAttrs: { pathname: "/api/attr/getBlockAttrs", method: "POST" },
            getBookmarkLabels: { pathname: "/api/attr/getBookmarkLabels", method: "POST" },
            setBlockAttrs: { pathname: "/api/attr/setBlockAttrs", method: "POST" },
        },
        block: {
            getBlockBreadcrumb: { pathname: "/api/block/getBlockBreadcrumb", method: "POST" },
            getDocInfo: { pathname: "/api/block/getDocInfo", method: "POST" },
        },
        filetree: {
            listDocsByPath: { pathname: "/api/filetree/listDocsByPath", method: "POST" },
            renameDoc: { pathname: "/api/filetree/renameDoc", method: "POST" },
            searchDocs: { pathname: "/api/filetree/searchDocs", method: "POST" },
        },
        notebook: {
            lsNotebooks: { pathname: "/api/notebook/lsNotebooks", method: "POST" },
        },
        query: {
            sql: { pathname: "/api/query/sql", method: "POST" },
        },
        search: {
            fullTextSearchBlock: { pathname: "/api/search/fullTextSearchBlock", method: "POST" },
        },
        storage: {
            getRecentDocs: { pathname: "/api/storage/getRecentDocs", method: "POST" },
        },
        system: {
            currentTime: { pathname: "/api/system/currentTime", method: "POST" },
            version: { pathname: "/api/system/version", method: "POST" },

            getConf: { pathname: "/api/system/getConf", method: "POST" },
        },
    } as const;

    public url: URL = new URL(globalThis.location?.origin ?? constants.SIYUAN_DEFAULT_SERVER); // 请求 URL
    public token: string = constants.SIYUAN_DEFAULT_TOKEN; // 请求 token
    public timeout: number = constants.REQUEST_TIMEOUT; // 请求超时时间
    public headers: {
        Authorization: string;
        [propName: string]: string;
    } = { Authorization: `Token ${constants.SIYUAN_DEFAULT_TOKEN}` }; // 请求头

    constructor(options: IOptions) {
        this.updateOptions(options);
    }

    /* 更新配置 */
    public updateOptions(options: IOptions) {
        this.url = options.url ?? this.url;
        this.token = options.token ?? this.token;
        this.timeout = options.timeout ?? this.timeout;

        this.headers.Authorization = `Token ${this.token}`;
    }

    /* 获取块属性 */
    public async getBlockAttrs(payload: getBlockAttrs.IPayload): Promise<getBlockAttrs.IResponse> {
        const response = await this._request(
            Client.api.attr.getBlockAttrs.pathname,
            Client.api.attr.getBlockAttrs.method,
            payload,
        ) as getBlockAttrs.IResponse;
        return response;
    }

    /* 获取所有书签 */
    public async getBookmarkLabels(): Promise<getBookmarkLabels.IResponse> {
        const response = await this._request(
            Client.api.attr.getBookmarkLabels.pathname,
            Client.api.attr.getBookmarkLabels.method,
        ) as getBookmarkLabels.IResponse;
        return response;
    }

    /* 设置块属性 */
    public async setBlockAttrs(payload: setBlockAttrs.IPayload): Promise<setBlockAttrs.IResponse> {
        const response = await this._request(
            Client.api.attr.setBlockAttrs.pathname,
            Client.api.attr.setBlockAttrs.method,
            payload,
        ) as setBlockAttrs.IResponse;
        return response;
    }

    /* 获得指定块的面包屑 */
    public async getBlockBreadcrumb(payload: getBlockBreadcrumb.IPayload): Promise<getBlockBreadcrumb.IResponse> {
        const response = await this._request(
            Client.api.block.getBlockBreadcrumb.pathname,
            Client.api.block.getBlockBreadcrumb.method,
            payload,
        ) as getBlockBreadcrumb.IResponse;
        return response;
    }

    /* 获得指定块所在文档信息 */
    public async getDocInfo(payload: getDocInfo.IPayload): Promise<getDocInfo.IResponse> {
        const response = await this._request(
            Client.api.block.getDocInfo.pathname,
            Client.api.block.getDocInfo.method,
            payload,
        ) as getDocInfo.IResponse;
        return response;
    }

    /* 查询子文档 */
    public async listDocsByPath(payload: listDocsByPath.IPayload): Promise<listDocsByPath.IResponse> {
        const response = await this._request(
            Client.api.filetree.listDocsByPath.pathname,
            Client.api.filetree.listDocsByPath.method,
            payload,
        ) as listDocsByPath.IResponse;
        return response;
    }

    /* 文档重命名 */
    public async renameDoc(payload: renameDoc.IPayload): Promise<renameDoc.IResponse> {
        const response = await this._request(
            Client.api.filetree.renameDoc.pathname,
            Client.api.filetree.renameDoc.method,
            payload,
        ) as renameDoc.IResponse;
        return response;
    }

    /* 搜索文档 */
    public async searchDocs(payload: searchDocs.IPayload): Promise<searchDocs.IResponse> {
        const response = await this._request(
            Client.api.filetree.searchDocs.pathname,
            Client.api.filetree.searchDocs.method,
            payload,
        ) as searchDocs.IResponse;
        return response;
    }

    /* 列出笔记本信息 */
    public async lsNotebooks(): Promise<lsNotebooks.IResponse> {
        const response = await this._request(
            Client.api.notebook.lsNotebooks.pathname,
            Client.api.notebook.lsNotebooks.method,
        ) as lsNotebooks.IResponse;
        return response;
    }

    /* SQL 查询 */
    public async sql(payload: sql.IPayload): Promise<sql.IResponse> {
        const response = await this._request(
            Client.api.query.sql.pathname,
            Client.api.query.sql.method,
            payload,
        ) as sql.IResponse;
        return response;
    }

    /* 全局搜索 */
    public async fullTextSearchBlock(payload: fullTextSearchBlock.IPayload): Promise<fullTextSearchBlock.IResponse> {
        const response = await this._request(
            Client.api.search.fullTextSearchBlock.pathname,
            Client.api.search.fullTextSearchBlock.method,
            payload,
        ) as fullTextSearchBlock.IResponse;
        return response;
    }

    /* 查询最近打开的文档 */
    public async getRecentDocs(): Promise<getRecentDocs.IResponse> {
        const response = await this._request(
            Client.api.storage.getRecentDocs.pathname,
            Client.api.storage.getRecentDocs.method,
        ) as getRecentDocs.IResponse;
        return response;
    }

    /* 获得配置 */
    public async getConf(): Promise<getConf.IResponse> {
        const response = await this._request(
            Client.api.system.getConf.pathname,
            Client.api.system.getConf.method,
        ) as getConf.IResponse;
        return response;
    }

    /* 获得内核 Unix 时间戳 (单位: ms) */
    public async currentTime(): Promise<currentTime.IResponse> {
        const response = await this._request(
            Client.api.system.currentTime.pathname,
            Client.api.system.currentTime.method,
        ) as currentTime.IResponse;
        return response;
    }

    /* 获得内核版本 */
    public async version(): Promise<version.IResponse> {
        const response = await this._request(
            Client.api.system.version.pathname,
            Client.api.system.version.method,
        ) as version.IResponse;
        return response;
    }

    public async _request(
        pathname: string,
        method: string,
        payload: object = {},
    ): Promise<kernel.IResponse> {
        try {
            this.url.pathname = pathname;

            const response = await fetch(
                this.url.href,
                {
                    body: JSON.stringify(payload),
                    method,
                    headers: this.headers,
                },
            );

            if (response.ok) {
                const body: kernel.IResponse = await response.json();

                if (body.code === 0) { // 内核正常响应
                    return body;
                }
                else { // 内核异常响应
                    const error = new KernelError(body, response);
                    throw error;
                }
            }

            else { // HTTP 请求异常
                const error = new HTTPError(response);
                throw error;
            }
        } catch (error) {
            throw error;
        }
    }
}
