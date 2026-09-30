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
 * Create a document with Markdown
 */
export interface IPayload {
    /**
     * Source URL of a web clipping, extra inline Markdown syntax is enabled for articles from
     * `ld246.com` or `liuyun.io`
     */
    readonly clippingHref?: string;
    /**
     * Document template path (relative to `data/templates/`), only used when `markdown` is empty
     */
    readonly docCreateTemplatePath?: string;
    /**
     * ID of the new document, generated automatically when empty
     */
    readonly id?: string;
    /**
     * Whether to locate the new document in the document tree after creation
     */
    readonly listDocTree?: boolean;
    /**
     * Markdown text (GitLab Flavored Markdown, GFM)
     * REF: https://github.github.com/gfm/
     */
    readonly markdown: string;
    /**
     * notebook ID
     */
    readonly notebook: string;
    /**
     * Parent document ID, used to specify the parent when several parent documents have the
     * same name
     */
    readonly parentID?: string;
    /**
     * Document path, which needs to start with / and separate levels with /
     * path here corresponds to the database hpath field
     */
    readonly path: string;
    /**
     * Document tags, separated by commas
     */
    readonly tags?: string;
    /**
     * Whether to mark the document title as empty (the title in `path` is used as a placeholder)
     */
    readonly titleEmpty?: boolean;
    /**
     * Whether to parse inline math
     */
    readonly withMath?: boolean;
}

// #endregion content
