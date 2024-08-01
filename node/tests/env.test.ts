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

import "dotenv/config";

import { describe, expect, it } from "vitest";

describe("environment Variable Test", async () => {
    it(`vITE_SIYUAN_SERVE`, async () => {
        expect(process.env.VITE_SIYUAN_SERVE).not.toBeUndefined();
    });
    it(`vITE_SIYUAN_TOKEN`, async () => {
        expect(process.env.VITE_SIYUAN_TOKEN).not.toBeUndefined();
    });
});
