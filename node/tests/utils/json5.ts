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

import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";

import JSON5 from "json5";

export async function loadJSON5<T>(filepath: string): Promise<T> {
    const json5 = await readFile(filepath, "utf-8");
    return JSON5.parse<T>(json5);
}

export async function loadJSON5Sync<T>(filepath: string): Promise<T> {
    const json5 = readFileSync(filepath, "utf-8");
    return JSON5.parse<T>(json5);
}
