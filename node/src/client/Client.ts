import * as axios from "axios";

// TODO: refactor
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
import sql from "@/types/kernel/api/query/sql";

import { kernel } from "@/types";
import { api } from "@/types/kernel";

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

export class Client {
    public static readonly api = {
        // TODO: refactor
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
        export: {
            exportMdContent: { pathname: "/api/export/exportMdContent", method: "POST" },
        },
        file: {
            getFile: { pathname: "/api/file/getFile", method: "POST" },
            putFile: { pathname: "/api/file/putFile", method: "POST" },
            readDir: { pathname: "/api/file/readDir", method: "POST" },
            removeFile: { pathname: "/api/file/removeFile", method: "POST" },
            renameFile: { pathname: "/api/file/renameFile", method: "POST" },
        },
        notification: {
            pushErrMsg: { pathname: "/api/notification/pushErrMsg", method: "POST" },
            pushMsg: { pathname: "/api/notification/pushMsg", method: "POST" },
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
    public async pandoc(
        payload: api.convert.pandoc.IPayload,
        config?: axios.AxiosRequestConfig,
    ): Promise<api.convert.pandoc.IResponse> {
        const response = await this._request(
            Client.api.convert.pandoc.pathname,
            Client.api.convert.pandoc.method,
            payload,
            config,
        ) as api.convert.pandoc.IResponse;
        return response;
    }

    /* 导出指定文档块为 Markdown */
    public async exportMdContent(
        payload: api.export.exportMdContent.IPayload,
        config?: axios.AxiosRequestConfig,
    ): Promise<api.export.exportMdContent.IResponse> {
        const response = await this._request(
            Client.api.export.exportMdContent.pathname,
            Client.api.export.exportMdContent.method,
            payload,
            config,
        ) as api.export.exportMdContent.IResponse;
        return response;
    }

    /* 获取文件 */
    public async getFile(
        payload: api.file.getFile.IPayload,
        config?: axios.AxiosRequestConfig,
    ): Promise<unknown> {
        const response = await this._request(
            Client.api.file.getFile.pathname,
            Client.api.file.getFile.method,
            payload,
            config,
            false,
        );
        return response;
    }

    /* 设置文件 */
    public async putFile(
        payload: api.file.putFile.IPayload,
        config?: axios.AxiosRequestConfig,
    ): Promise<api.file.putFile.IResponse> {
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
            false,
        ) as api.file.putFile.IResponse;
        return response;
    }

    /* 获取文件目录下级内容 */
    public async readDir(
        payload: api.file.readDir.IPayload,
        config?: axios.AxiosRequestConfig,
    ): Promise<api.file.readDir.IResponse> {
        const response = await this._request(
            Client.api.file.readDir.pathname,
            Client.api.file.readDir.method,
            payload,
            config,
        ) as api.file.readDir.IResponse;
        return response;
    }

    /* 删除文件/目录 */
    public async removeFile(
        payload: api.file.removeFile.IPayload,
        config?: axios.AxiosRequestConfig,
    ): Promise<api.file.removeFile.IResponse> {
        const response = await this._request(
            Client.api.file.removeFile.pathname,
            Client.api.file.removeFile.method,
            payload,
            config,
        ) as api.file.removeFile.IResponse;
        return response;
    }

    /* 重命名/移动文件/目录 */
    public async renameFile(
        payload: api.file.renameFile.IPayload,
        config?: axios.AxiosRequestConfig,
    ): Promise<api.file.renameFile.IResponse> {
        const response = await this._request(
            Client.api.file.renameFile.pathname,
            Client.api.file.renameFile.method,
            payload,
            config,
        ) as api.file.renameFile.IResponse;
        return response;
    }

    /* 推送错误消息 */
    public async pushErrMsg(
        payload: api.notification.pushErrMsg.IPayload,
        config?: axios.AxiosRequestConfig,
    ): Promise<api.notification.pushErrMsg.IResponse> {
        const response = await this._request(
            Client.api.notification.pushErrMsg.pathname,
            Client.api.notification.pushErrMsg.method,
            payload,
            config,
        ) as api.notification.pushErrMsg.IResponse;
        return response;
    }

    /* 推送提示消息 */
    public async pushMsg(
        payload: api.notification.pushMsg.IPayload,
        config?: axios.AxiosRequestConfig,
    ): Promise<api.notification.pushMsg.IResponse> {
        const response = await this._request(
            Client.api.notification.pushMsg.pathname,
            Client.api.notification.pushMsg.method,
            payload,
            config,
        ) as api.notification.pushMsg.IResponse;
        return response;
    }

    /* 获取内核启动进度 */
    public async bootProgress(
        config?: axios.AxiosRequestConfig,
    ): Promise<api.system.bootProgress.IResponse> {
        const response = await this._request(
            Client.api.system.bootProgress.pathname,
            Client.api.system.bootProgress.method,
            undefined,
            config,
        ) as api.system.bootProgress.IResponse;
        return response;
    }

    /* 获得内核 Unix 时间戳 (单位: ms) */
    public async currentTime(
        config?: axios.AxiosRequestConfig,
    ): Promise<api.system.currentTime.IResponse> {
        const response = await this._request(
            Client.api.system.currentTime.pathname,
            Client.api.system.currentTime.method,
            undefined,
            config,
        ) as api.system.currentTime.IResponse;
        return response;
    }

    /* 获得内核版本 */
    public async version(
        config?: axios.AxiosRequestConfig,
    ): Promise<api.system.version.IResponse> {
        const response = await this._request(
            Client.api.system.version.pathname,
            Client.api.system.version.method,
            undefined,
            config,
        ) as api.system.version.IResponse;
        return response;
    }

    /* 渲染 kramdown 模板文件 */
    public async render(
        payload: api.template.render.IPayload,
        config?: axios.AxiosRequestConfig,
    ): Promise<api.template.render.IResponse> {
        const response = await this._request(
            Client.api.template.render.pathname,
            Client.api.template.render.method,
            payload,
            config,
        ) as api.template.render.IResponse;
        return response;
    }

    /* 渲染 Sprig 模板 */
    public async renderSprig(
        payload: api.template.renderSprig.IPayload,
        config?: axios.AxiosRequestConfig,
    ): Promise<api.template.renderSprig.IResponse> {
        const response = await this._request(
            Client.api.template.renderSprig.pathname,
            Client.api.template.renderSprig.method,
            payload,
            config,
        ) as api.template.renderSprig.IResponse;
        return response;
    }

    public async _request<P extends kernel.IPayload, R>(
        pathname: string,
        method: string,
        payload?: P,
        config?: axios.AxiosRequestConfig,
        normal: boolean = true,
    ): Promise<R> {
        try {
            const response = await this._axios.request<R>({
                url: pathname,
                method,
                data: payload,
                ...config,
            });

            if (response.status === axios.HttpStatusCode.Ok) {
                if (normal && typeof response.data === "object") {
                    return this._parseResponse(response as axios.AxiosResponse<kernel.IResponse>) as R;
                }
                else {
                    return response.data;
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

    /**
     * 解析内核响应
     */
    public _parseResponse<T extends kernel.IResponse>(response: axios.AxiosResponse<T>): T {
        if (response.data.code === 0) { // 内核正常响应
            return response.data;
        }
        else { // 内核异常响应
            const error = new KernelError(response.data, response);
            throw error;
        }
    }
}
