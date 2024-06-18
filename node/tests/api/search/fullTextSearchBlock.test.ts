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

import { describe } from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import type fullTextSearchBlock from "@/types/kernel/api/search/fullTextSearchBlock";

const pathname = client.Client.api.search.fullTextSearchBlock.pathname;

interface ICase {
    name: string;
    payload: fullTextSearchBlock.IPayload;
    debug: boolean;
}

describe.concurrent(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const cases: ICase[] = (() => {
        const payloads: fullTextSearchBlock.IPayload[] = [];
        for (const groupBy of [
            0,
            1,
        ]) {
            for (const orderBy of [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
            ]) {
                for (const method of [
                    0,
                    1,
                    2,
                    3,
                ]) {
                    const query = (() => {
                        switch (method) {
                            // eslint-disable-next-line default-case-last
                            default:
                            case 0:
                                return "测试";

                            case 1:
                                return "\"测试\"";

                            case 2:
                                return "^测试$";

                            case 3:
                                return "SELECT * FROM blocks_fts WHERE blocks_fts MATCH '测试' LIMIT 1;";
                        }
                    })();
                    payloads.push({
                        method,
                        groupBy,
                        orderBy,
                        page: 1,
                        paths: [
                            "20210808180117-czj9bvb", // 简体中文用户手册
                            "20211226090932-5lcq56f", // 繁体中文用户手册
                            "20210808180117-6v0mkxr", // 英文用户手册
                        ],
                        query,
                        types: {
                            // heading: false,
                            // paragraph: false,
                            // mathBlock: false,
                            // table: false,
                            // codeBlock: false,
                            // htmlBlock: false,
                            // embedBlock: false,

                            document: true,
                            // superBlock: false,
                            // blockquote: false,
                            // list: false,
                            // listItem: false,
                        },
                    });
                }
            }
        }
        return payloads.map(payload => ({
            name: `method: ${payload.method} groupBy: ${payload.groupBy} orderBy: ${payload.orderBy}`,
            payload,
            debug: false,
        }));
    })();

    cases.forEach((item) => {
        testKernelAPI<fullTextSearchBlock.IPayload, fullTextSearchBlock.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                validate: validate_payload,
            },
            request: payload => client.client.fullTextSearchBlock(payload!),
            response: {
                validate: validate_response,
            },
            debug: item.debug,
        });
    });
});
