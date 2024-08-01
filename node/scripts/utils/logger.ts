// Copyright (C) 2023 SiYuan Community
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import path from "node:path";

export function change(filePath: string) {
    const file = path.parse(filePath);
    console.debug(`\t\x1B[32m+ [${file.base}] \x1B[1m${filePath}\x1B[0m`);
}

export function remove(filePath: string) {
    const file = path.parse(filePath);
    console.debug(`\t\x1B[33m- [${file.base}] \x1B[1m${filePath}\x1B[0m`);
}

export function error(filePath: string, error: unknown) {
    console.error(`\t\x1B[31m! [${String(error)}] \x1B[1m${filePath}\x1B\x1B[0m`);
    console.error(error);
}
