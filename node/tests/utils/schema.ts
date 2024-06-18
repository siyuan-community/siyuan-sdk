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

import { resolve } from "node:path";
import process from "node:process";

import addFormats from "ajv-formats";
import type { Options, Schema, ValidateFunction } from "ajv/dist/2020";
import Ajv2020 from "ajv/dist/2020";

import { loadJSON5 } from "./json5";
import constants from "@/constants";

export class SchemaJSON {
    public static resolveSchemaPath(
        pathname: string, //
        filename: string,
    ): string {
        return resolve(
            process.cwd(), //
            constants.SCHEMA_DIR_RELATIVE_PATH,
            `./kernel${pathname}`,
            `./${filename}`,
        );
    }

    public static resolvePayloadSchemaPath(
        pathname: string, //
        filename: string = constants.SCHEMA_FILENAME_PAYLOAD,
    ): string {
        return SchemaJSON.resolveSchemaPath(pathname, filename);
    }

    public static resolveResponseSchemaPath(
        pathname: string, //
        filename: string = constants.SCHEMA_FILENAME_RESPONSE,
    ): string {
        return SchemaJSON.resolveSchemaPath(pathname, filename);
    }

    protected readonly _ajv: Ajv2020;
    protected _schema!: Schema; // JSON Schema 定义对象

    public get schema(): Schema {
        return this._schema;
    }

    constructor(
        public filepath: string,
        options: Options = {
            allowUnionTypes: true,
        },
    ) {
        this._ajv = addFormats(new Ajv2020(options));
    }

    public updateSchema(schema: Schema): void {
        this._schema = schema;
    }

    /**
     * 加载 JSON Schema 文件
     * 支持 *.schema.json 与 *.schema.json5
     */
    public async loadSchemaFile(filepath: string = this.filepath): Promise<Schema> {
        let schema: Schema;
        switch (true) {
            case filepath.endsWith(".json5"):
                schema = await loadJSON5<Schema>(filepath);
                break;

            case filepath.endsWith(".json"):
            default:
                schema = await import(filepath);
                break;
        }
        this.updateSchema(schema);
        return this.schema;
    }

    public constructValidateFuction(): ValidateFunction {
        // REF https://ajv.js.org/guide/getting-started.html#basic-data-validation
        const validate = this._ajv.compile(this.schema);
        return validate;
    }
}
