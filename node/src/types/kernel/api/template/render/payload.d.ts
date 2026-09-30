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
 * render template file
 */
export interface IPayload {
    /**
     * Unsaved template content, only available in preview mode (`path` is still used to resolve
     * sub-templates in the same directory)
     */
    readonly content?: string;
    /**
     * document block ID
     */
    readonly id: string;
    /**
     * Render mode, determined by `preview` when omitted
     * - `preview`: Preview, `createDocTree` is evaluated but not stored
     * - `editorInsert`: Insert in the editor, the document tree plan is stored
     */
    readonly mode?: TTemplateRenderMode;
    /**
     * the absolute path of Kramdown template file
     */
    readonly path: string;
    /**
     * Whether it is in preview mode (ignored when `mode` is specified)
     */
    readonly preview?: boolean;
}

/**
 * Render mode, determined by `preview` when omitted
 * - `preview`: Preview, `createDocTree` is evaluated but not stored
 * - `editorInsert`: Insert in the editor, the document tree plan is stored
 */
export type TTemplateRenderMode = "editorInsert" | "preview";

// #endregion content
