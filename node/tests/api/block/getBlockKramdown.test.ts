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

import {
    describe,
} from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import getBlockKramdown from "@/types/kernel/api/block/getBlockKramdown";

const pathname = client.Client.api.block.getBlockKramdown.pathname;

interface ICase {
    name: string,
    payload: getBlockKramdown.IPayload,
    debug: boolean,
    after?: (response: getBlockKramdown.IResponse) => void,
}

describe.concurrent(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const cases: ICase[] = [
        /* 文档块 */
        {
            name: "/请从这里开始/编辑器/排版元素",
            payload: {
                id: "20200825162036-4dx365o",
            },
            debug: false,
        },
        /* 超级块 */
        {
            name: "/请从这里开始/编辑器/排版元素/超级块",
            payload: {
                id: "20210604234955-651jbge",
            },
            debug: false,
        },
        /* 引述块 */
        {
            name: "/请从这里开始/编辑器/排版元素/引述块",
            payload: {
                id: "20210604223030-6gapuyv",
            },
            debug: false,
        },
        /* 列表块 */
        {
            name: "/请从这里开始/编辑器/排版元素/无序列表",
            payload: {
                id: "20210104091228-tue1zbn",
            },
            debug: false,
        },
        /* 列表项 */
        {
            name: "/请从这里开始/编辑器/排版元素/无序列表",
            payload: {
                id: "20210104091228-ao01ihn",
            },
            debug: false,
        },
        /* 标题块 */
        {
            name: "/请从这里开始/编辑器/排版元素/有序、无序、任务列表",
            payload: {
                id: "20210104091228-okx8vv6",
            },
            debug: false,
        },
        /* 段落块 */
        {
            name: "/请从这里开始/编辑器/排版元素/行级元素",
            payload: {
                id: "20210604222221-9zkgkky",
            },
            debug: false,
        },
        /* 公式块 */
        {
            name: "/请从这里开始/编辑器/排版元素/公式块",
            payload: {
                id: "20210104091228-9ok9gv4",
            },
            debug: false,
        },
        /* 表格块 */
        {
            name: "/请从这里开始/编辑器/排版元素/表格块",
            payload: {
                id: "20210104091228-eem86ni",
            },
            debug: false,
        },
        /* 代码块 */
        {
            name: "/请从这里开始/编辑器/排版元素/代码块",
            payload: {
                id: "20210104091228-mwb2x54",
            },
            debug: false,
        },
        /* HTML 块 */
        {
            name: "/请从这里开始/编辑器/排版元素/HTML 块",
            payload: {
                id: "20220312004517-f6i1k8m",
            },
            debug: false,
        },
        /* 嵌入块 */
        {
            name: "/请从这里开始/编辑器/排版元素/嵌入块",
            payload: {
                id: "20210604222515-ggpd5hs",
            },
            debug: false,
        },
        /* 分割线 */
        {
            name: "/请从这里开始/编辑器/排版元素/分割线",
            payload: {
                id: "20210604222430-tctcbzh",
            },
            debug: false,
        },
        /* 音频块 */
        {
            name: "/请从这里开始/编辑器/排版元素/音频块",
            payload: {
                id: "20210608113713-wm8271x",
            },
            debug: false,
        },
        /* 视频块 */
        {
            name: "/请从这里开始/编辑器/排版元素/视频块",
            payload: {
                id: "20210608113914-zvtw5kj",
            },
            debug: false,
        },
        /* iframe */
        {
            name: "/请从这里开始/编辑器/排版元素/iframe",
            payload: {
                id: "20220908200902-6rqv2wt",
            },
            debug: false,
        },
    ];
    cases.forEach(item => {
        testKernelAPI<getBlockKramdown.IPayload, getBlockKramdown.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                validate: validate_payload,
            },
            request: (payload) => client.client.getBlockKramdown(payload!),
            response: {
                validate: validate_response,
                test: item.after,
            },
            debug: item.debug,
        });
    });
});
