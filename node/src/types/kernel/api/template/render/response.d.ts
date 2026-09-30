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
export interface IResponse {
    /**
     * status code
     */
    readonly code: number;
    readonly data: IData;
    /**
     * status message
     */
    readonly msg: string;
}

/**
 * the result of rendering
 */
export interface IData {
    /**
     * the DOM string of template rendering result
     */
    readonly content: string;
    readonly docTreePlan?: IDocTreePlan;
    /**
     * the absolute path of Kramdown template file
     */
    readonly path: string;
}

/**
 * Plan of the sub-documents declared by the template through `createDocTree`
 */
export interface IDocTreePlan {
    /**
     * Number of documents to create
     */
    readonly count: number;
    /**
     * Plan ID, only generated in `editorInsert` mode, an empty string in preview
     */
    readonly id: string;
    /**
     * Documents to create (flattened in pre-order)
     */
    readonly nodes: IDocTreePlanNode[];
}

/**
 * A document to create
 */
export interface IDocTreePlanNode {
    /**
     * Depth (starting from 1)
     */
    readonly depth: number;
    /**
     * Human-readable path
     */
    readonly hPath: string;
    /**
     * Document ID
     */
    readonly id: string;
    /**
     * Parent document ID, the target document of the rendering for the first level
     */
    readonly parentID: string;
    /**
     * Document title
     */
    readonly title: string;
}

// #endregion content
