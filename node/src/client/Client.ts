import * as axios from "axios";

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

import pandoc from "@/types/kernel/api/convert/pandoc";

import pushErrMsg from "@/types/kernel/api/notification/pushErrMsg";
import pushMsg from "@/types/kernel/api/notification/pushMsg";

import bootProgress from "@/types/kernel/api/system/bootProgress";
import currentTime from "@/types/kernel/api/system/currentTime";
import version from "@/types/kernel/api/system/version";

import constants from "@/constants";
import { HTTPError } from "@/errors/http";
import { KernelError } from "@/errors/kernel";


export interface IOptions extends axios.AxiosRequestConfig {
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
    /**
     * 请求超时时间
     * REF: https://www.axios-http.cn/docs/req_config
     */
    timeout?: number,
}

export interface IHeaders {
    Authorization: string,
    [key: string]: string,
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

        convert: {
            pandoc: { pathname: "/api/convert/pandoc", method: "POST" },
        },
        notification: {
            pushErrMsg: { pathname: "/api/notification/pushErrMsg", method: "POST" },
            pushMsg: { pathname: "/api/notification/pushMsg", method: "POST" },
        },
        system: {
            bootProgress: { pathname: "/api/system/bootProgress", method: "POST" },
            currentTime: { pathname: "/api/system/currentTime", method: "POST" },
            version: { pathname: "/api/system/version", method: "POST" },

            getConf: { pathname: "/api/system/getConf", method: "POST" },
        },
    } as const;

    protected _axios = axios.default.create({
        baseURL: globalThis.document?.baseURI
            ?? globalThis.location?.origin
            ?? constants.SIYUAN_DEFAULT_BASE_URL,
        timeout: constants.REQUEST_TIMEOUT,
        headers: {
            Authorization: `Token ${constants.SIYUAN_DEFAULT_TOKEN}`,
        },
    });

    constructor(options: IOptions) {
        this.updateOptions(options);
    }

    /* 更新配置 */
    public updateOptions(options: IOptions) {
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
    }

    /* 获取块属性 */
    public async getBlockAttrs(payload: getBlockAttrs.IPayload, config?: axios.AxiosRequestConfig): Promise<getBlockAttrs.IResponse> {
        const response = await this._request(
            Client.api.attr.getBlockAttrs.pathname,
            Client.api.attr.getBlockAttrs.method,
            payload,
            config,
        ) as getBlockAttrs.IResponse;
        return response;
    }

    /* 获取所有书签 */
    public async getBookmarkLabels(config?: axios.AxiosRequestConfig): Promise<getBookmarkLabels.IResponse> {
        const response = await this._request(
            Client.api.attr.getBookmarkLabels.pathname,
            Client.api.attr.getBookmarkLabels.method,
            undefined,
            config,
        ) as getBookmarkLabels.IResponse;
        return response;
    }

    /* 设置块属性 */
    public async setBlockAttrs(payload: setBlockAttrs.IPayload, config?: axios.AxiosRequestConfig): Promise<setBlockAttrs.IResponse> {
        const response = await this._request(
            Client.api.attr.setBlockAttrs.pathname,
            Client.api.attr.setBlockAttrs.method,
            payload,
            config,
        ) as setBlockAttrs.IResponse;
        return response;
    }

    /* 获得指定块的面包屑 */
    public async getBlockBreadcrumb(payload: getBlockBreadcrumb.IPayload, config?: axios.AxiosRequestConfig): Promise<getBlockBreadcrumb.IResponse> {
        const response = await this._request(
            Client.api.block.getBlockBreadcrumb.pathname,
            Client.api.block.getBlockBreadcrumb.method,
            payload,
            config,
        ) as getBlockBreadcrumb.IResponse;
        return response;
    }

    /* 获得指定块所在文档信息 */
    public async getDocInfo(payload: getDocInfo.IPayload, config?: axios.AxiosRequestConfig): Promise<getDocInfo.IResponse> {
        const response = await this._request(
            Client.api.block.getDocInfo.pathname,
            Client.api.block.getDocInfo.method,
            payload,
            config,
        ) as getDocInfo.IResponse;
        return response;
    }

    /* 查询子文档 */
    public async listDocsByPath(payload: listDocsByPath.IPayload, config?: axios.AxiosRequestConfig): Promise<listDocsByPath.IResponse> {
        const response = await this._request(
            Client.api.filetree.listDocsByPath.pathname,
            Client.api.filetree.listDocsByPath.method,
            payload,
            config,
        ) as listDocsByPath.IResponse;
        return response;
    }

    /* 文档重命名 */
    public async renameDoc(payload: renameDoc.IPayload, config?: axios.AxiosRequestConfig): Promise<renameDoc.IResponse> {
        const response = await this._request(
            Client.api.filetree.renameDoc.pathname,
            Client.api.filetree.renameDoc.method,
            payload,
            config,
        ) as renameDoc.IResponse;
        return response;
    }

    /* 搜索文档 */
    public async searchDocs(payload: searchDocs.IPayload, config?: axios.AxiosRequestConfig): Promise<searchDocs.IResponse> {
        const response = await this._request(
            Client.api.filetree.searchDocs.pathname,
            Client.api.filetree.searchDocs.method,
            payload,
            config,
        ) as searchDocs.IResponse;
        return response;
    }

    /* 列出笔记本信息 */
    public async lsNotebooks(config?: axios.AxiosRequestConfig): Promise<lsNotebooks.IResponse> {
        const response = await this._request(
            Client.api.notebook.lsNotebooks.pathname,
            Client.api.notebook.lsNotebooks.method,
            undefined,
            config,
        ) as lsNotebooks.IResponse;
        return response;
    }

    /* SQL 查询 */
    public async sql(payload: sql.IPayload, config?: axios.AxiosRequestConfig): Promise<sql.IResponse> {
        const response = await this._request(
            Client.api.query.sql.pathname,
            Client.api.query.sql.method,
            payload,
            config,
        ) as sql.IResponse;
        return response;
    }

    /* 全局搜索 */
    public async fullTextSearchBlock(payload: fullTextSearchBlock.IPayload, config?: axios.AxiosRequestConfig): Promise<fullTextSearchBlock.IResponse> {
        const response = await this._request(
            Client.api.search.fullTextSearchBlock.pathname,
            Client.api.search.fullTextSearchBlock.method,
            payload,
            config,
        ) as fullTextSearchBlock.IResponse;
        return response;
    }

    /* 查询最近打开的文档 */
    public async getRecentDocs(config?: axios.AxiosRequestConfig): Promise<getRecentDocs.IResponse> {
        const response = await this._request(
            Client.api.storage.getRecentDocs.pathname,
            Client.api.storage.getRecentDocs.method,
            undefined,
            config,
        ) as getRecentDocs.IResponse;
        return response;
    }

    /* 获得配置 */
    public async getConf(config?: axios.AxiosRequestConfig): Promise<getConf.IResponse> {
        const response = await this._request(
            Client.api.system.getConf.pathname,
            Client.api.system.getConf.method,
            undefined,
            config,
        ) as getConf.IResponse;
        return response;
    }

    /* 调用 pandoc 转换转换文件 */
    public async pandoc(payload: pandoc.IPayload, config?: axios.AxiosRequestConfig): Promise<pandoc.IResponse> {
        const response = await this._request(
            Client.api.convert.pandoc.pathname,
            Client.api.convert.pandoc.method,
            payload,
            config,
        ) as pandoc.IResponse;
        return response;
    }

    /* 推送错误消息 */
    public async pushErrMsg(payload: pushErrMsg.IPayload, config?: axios.AxiosRequestConfig): Promise<pushErrMsg.IResponse> {
        const response = await this._request(
            Client.api.notification.pushErrMsg.pathname,
            Client.api.notification.pushErrMsg.method,
            payload,
            config,
        ) as pushErrMsg.IResponse;
        return response;
    }

    /* 推送提示消息 */
    public async pushMsg(payload: pushMsg.IPayload, config?: axios.AxiosRequestConfig): Promise<pushMsg.IResponse> {
        const response = await this._request(
            Client.api.notification.pushMsg.pathname,
            Client.api.notification.pushMsg.method,
            payload,
            config,
        ) as pushMsg.IResponse;
        return response;
    }

    /* 获取内核启动进度 */
    public async bootProgress(config?: axios.AxiosRequestConfig): Promise<bootProgress.IResponse> {
        const response = await this._request(
            Client.api.system.bootProgress.pathname,
            Client.api.system.bootProgress.method,
            undefined,
            config,
        ) as bootProgress.IResponse;
        return response;
    }

    /* 获得内核 Unix 时间戳 (单位: ms) */
    public async currentTime(config?: axios.AxiosRequestConfig): Promise<currentTime.IResponse> {
        const response = await this._request(
            Client.api.system.currentTime.pathname,
            Client.api.system.currentTime.method,
            undefined,
            config,
        ) as currentTime.IResponse;
        return response;
    }

    /* 获得内核版本 */
    public async version(config?: axios.AxiosRequestConfig): Promise<version.IResponse> {
        const response = await this._request(
            Client.api.system.version.pathname,
            Client.api.system.version.method,
            undefined,
            config,
        ) as version.IResponse;
        return response;
    }

    public async _request<P extends kernel.IPayload, R extends kernel.IResponse>(
        pathname: string,
        method: string,
        payload?: P,
        config?: axios.AxiosRequestConfig,
    ): Promise<R> {
        try {
            const response = await this._axios.request<R>({
                url: pathname,
                method,
                data: payload,
                ...config,
            });

            if (response.status === axios.HttpStatusCode.Ok) {
                const body = response.data;

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
