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
import { testKernelAPI } from "~/tests/utils/test";
import { SchemaJSON } from "~/tests/utils/schema";

import getDocHistoryContent from "@/types/kernel/api/history/getDocHistoryContent";

const pathname = client.Client.api.history.getDocHistoryContent.pathname;

interface ICase {
    name: string,
    before?: () => void,
    payload: getDocHistoryContent.IPayload,
    after?: (response: getDocHistoryContent.IResponse, payload: getDocHistoryContent.IPayload) => void,
    debug: boolean,
}

describe(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const cases: ICase[] = [
        {
            name: "history without keyword",
            payload: {
                historyPath: "D:\\Note\\siyuan\\workspace\\test\\history\\2023-08-08-175043-update\\20210808180117-czj9bvb\\20200812220555-lj3enxa.sy",
            },
            debug: false,
        },
        {
            name: "history with keyword",
            payload: {
                historyPath: "D:\\Note\\siyuan\\workspace\\test\\history\\2023-08-08-175043-update\\20210808180117-czj9bvb\\20200812220555-lj3enxa.sy",
                k: "开始",
            },
            debug: false,
        },
    ];

    cases.forEach(item => {
        testKernelAPI<getDocHistoryContent.IPayload, getDocHistoryContent.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                validate: validate_payload,
                test: item.before,
            },
            request: (payload) => client.client.getDocHistoryContent(payload!),
            response: {
                validate: validate_response,
                test: item.after,
            },
            debug: item.debug,
        });
    });
});
