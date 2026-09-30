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

// #region content

/**
 * Exports the specified document block as Markdown
 */
export interface IPayload {
    /**
     * Whether to add the document title at the beginning, the export setting is used by default
     */
    readonly addTitle?: boolean;
    /**
     * Whether to adjust heading levels when exporting a block (starting from level 1)
     */
    readonly adjustHeadingLevel?: boolean;
    /**
     * Export mode of embed blocks, the export setting is used by default
     * - `0`: Original text
     * - `1`: Blockquote
     */
    readonly embedMode?: number;
    /**
     * Whether to replace theme CSS variables in inline styles with their values
     */
    readonly fillCSSVar?: boolean;
    /**
     * doc block ID
     */
    readonly id: string;
    /**
     * Whether to export images as `img` tags
     */
    readonly imgTag?: boolean;
    /**
     * Export mode of block references, the export setting is used by default
     * - `2`: Anchor text with a link to the block
     * - `3`: Anchor text only
     * - `4`: Anchor text with a footnote
     */
    readonly refMode?: number;
    /**
     * Whether to add YAML Front Matter
     */
    readonly yfm?: boolean;
}

// #endregion content
