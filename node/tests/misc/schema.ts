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

import { resolve } from "path";

import Ajv2020, { Schema, ValidateFunction } from "ajv/dist/2020";

import constants from "./constants";
import { loadJSON5 } from "./json5";

export class SchemaJSON5 {
    public static resolveSchemaPath(pathname: string, filename: string): string {
        return resolve(
            process.cwd(),
            constants.SCHEMA_DIR_RELATIVE_PATH,
            `./siyuan${pathname}`,
            `./${filename}`,
        );
    }

    public static resolvePayloadSchemaPath(pathname: string, filename: string = constants.SCHEMA_FILENAME_PAYLOAD): string {
        return SchemaJSON5.resolveSchemaPath(pathname, filename);
    }

    public static resolveResponseSchemaPath(pathname: string, filename: string = constants.SCHEMA_FILENAME_RESPONSE): string {
        return SchemaJSON5.resolveSchemaPath(pathname, filename);;
    }

    protected readonly _ajv: Ajv2020;
    protected _schema!: Schema; // JSON Schema 定义对象

    public get schema(): Schema {
        return this._schema;
    }

    constructor(
        public filepath: string,
    ) {
        this._ajv = new Ajv2020();
    }

    public updateSchema(schema: Schema): void {
        this._schema = schema;
    }

    public async loadSchemaFile(filepath: string = this.filepath): Promise<Schema> {
        const schema = await loadJSON5<Schema>(filepath);
        this.updateSchema(schema);
        return this.schema;
    }

    public constructValidateFuction(): ValidateFunction {
        // REF https://ajv.js.org/guide/getting-started.html#basic-data-validation
        const validate = this._ajv.compile(this.schema)
        return validate;
    }
}
