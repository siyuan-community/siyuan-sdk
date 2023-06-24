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

import path from "path";

export function change(filePath: string) {
    const file = path.parse(filePath);
    console.debug(`\t\x1b[32m+ [${file.base}] \x1b[1m${filePath}\x1b[0m`);
}

export function remove(filePath: string) {
    const file = path.parse(filePath);
    console.debug(`\t\x1b[33m- [${file.base}] \x1b[1m${filePath}\x1b[0m`);
}
