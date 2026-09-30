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
 * Get notebook configuration
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
 * notebook info
 */
export interface IData {
    /**
     * notebook ID
     */
    readonly box: string;
    readonly conf: IConf;
    /**
     * notebook name
     */
    readonly name: string;
}

/**
 * notebook configuration
 */
export interface IConf {
    /**
     * Key wrapping parameters of the encrypted notebook, `null` for notebooks that are not
     * encrypted and for non-administrator roles
     */
    readonly boxCrypt: IBoxCrypt | null;
    /**
     * notebook open state
     */
    readonly closed: boolean;
    /**
     * the path of new daily note
     */
    readonly dailyNoteSavePath: string;
    /**
     * the template file path of new daily note
     */
    readonly dailyNoteTemplatePath: string;
    /**
     * New document save notebook
     */
    readonly docCreateSaveBox: string;
    /**
     * New document save location
     */
    readonly docCreateSavePath: string;
    /**
     * Template path for new documents (relative to `data/templates/`), the global setting is
     * used when empty
     */
    readonly docCreateTemplatePath: string;
    /**
     * Whether the notebook is encrypted
     */
    readonly encrypted: boolean;
    /**
     * notebook icon
     */
    readonly icon: string;
    /**
     * notebook name
     */
    readonly name: string;
    /**
     * The notebook that was stored when a new document was created using block references
     */
    readonly refCreateSaveBox: string;
    /**
     * The document path that was stored when a new document was created using block references
     */
    readonly refCreateSavePath: string;
    /**
     * sequence number
     */
    readonly sort: number;
    /**
     * document sorting mode
     */
    readonly sortMode: number;
}

/**
 * Key wrapping parameters of an encrypted notebook
 */
export interface IBoxCrypt {
    /**
     * Creation time (Unix timestamp, unit: ms)
     */
    readonly createdAt: number;
    /**
     * Encrypted metadata (base64), omitted when empty
     */
    readonly metadata?: string;
    /**
     * Version of the key wrapping specification
     */
    readonly spec: number;
    /**
     * Nonce used to wrap the data encryption key (base64)
     */
    readonly wrapNonce: null | string;
    /**
     * Data encryption key wrapped with the KEK (base64)
     */
    readonly wrappedDEK: null | string;
}

// #endregion content
