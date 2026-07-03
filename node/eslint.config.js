import antfu, {
    GLOB_JS,
    GLOB_JSX,
} from "@antfu/eslint-config";
import tsdoc from "eslint-plugin-tsdoc";

/**
 * @type {import("@antfu/eslint-config").TypedFlatConfigItem['rules']}
 */
const rules = {
    "accessor-pairs": ["off"],
    "sort-imports": ["off"],
    "import/order": ["off"],
    "ts/no-empty-object-type": [
        "warn",
        {
            allowInterfaces: "always",
        },
    ],
    "ts/no-use-before-define": [
        "error",
        {
            allowNamedExports: true,
        },
    ],
    "perfectionist/sort-array-includes": [
        "warn",
        {
        },
    ],
    "perfectionist/sort-exports": [
        "warn",
        {},
    ],
    "perfectionist/sort-imports": [
        "warn",
        {
            groups: [
                "value-side-effect", // import "module";

                [
                    "$node", // import path from "node:path";
                    "value-builtin", // import path from "path";
                ],
                "value-external", // import axios from "axios";
                [
                    "$repo", // import module from "@repo/module";
                    "$workspace", // import module from "@workspace/module";
                ],
                "value-subpath", // import module from "#module";
                "$base", // import module from "~/module";
                "value-internal", // import module from "@/module";
                [
                    "value-parent", // import module from "../module";
                    "value-sibling", // import module from "./module";
                    "value-index", // import module from ".";
                ],
                [
                    "$vue", // import Component from "Component.vue";
                    "$svelte", // import Component from "Component.svelte";
                ],
                "$json", // import data from "data.json";
                "value-import",
                "unknown",

                [
                    "$node-type", // import type path from "node:path";
                    "type-builtin", // import type path from "path";
                ],
                "type-external", // import type axios from "axios";
                [
                    "$repo-type", // import type module from "@repo/module";
                    "$workspace-type", // import type module from "@workspace/module";
                ],
                "$base-type", // import type module from "~/module";
                "type-internal", // import type module from "@/module";
                [
                    "type-parent", // import type module from "../module";
                    "type-sibling", // import type module from "./module";
                    "type-index", // import type module from ".";
                ],
                [
                    "$vue-type", // import type Component from "Component.vue";
                    "$svelte-type", // import type Component from "Component.svelte";
                ],
                "$json-type", // import type data from "data.json";
                "type-import",

                "side-effect-style", // import "style.css";
                "value-style", // import styles from "./index.module.css";
                "value-ts-equals-import", // import log = console.log;
            ],
            internalPattern: [
                "^@/.*",
            ],
            customGroups: [
                { groupName: "$node-type", elementNamePattern: "^node:.+", selector: "type" },
                { groupName: "$repo-type", elementNamePattern: "^@repo/.*", selector: "type" },
                { groupName: "$workspace-type", elementNamePattern: "^@workspace/.*", selector: "type" },
                { groupName: "$base-type", elementNamePattern: "^~/.*", selector: "type" },
                { groupName: "$vue-type", elementNamePattern: ".+\\.vue", selector: "type" },
                { groupName: "$svelte-type", elementNamePattern: ".+\\.svelte(\\.(j|t)s)?", selector: "type" },
                { groupName: "$json-type", elementNamePattern: ".+\\.json", selector: "type" },

                { groupName: "$node", elementNamePattern: "^node:.+" },
                { groupName: "$repo", elementNamePattern: "^@repo/.*" },
                { groupName: "$workspace", elementNamePattern: "^@workspace/.*" },
                { groupName: "$base", elementNamePattern: "^~/.*" },
                { groupName: "$vue", elementNamePattern: ".+\\.vue" },
                { groupName: "$svelte", elementNamePattern: ".+\\.svelte(\\.(j|t)s)?" },
                { groupName: "$json", elementNamePattern: ".+\\.json" },
            ],
        },
    ],
    "perfectionist/sort-named-exports": [
        "warn",
        {
            groups: ["value-export", "type-export", "unknown"],
        },
    ],
    "perfectionist/sort-named-imports": [
        "warn",
        {
            groups: ["value-import", "type-import", "unknown"],
            ignoreAlias: false,
        },
    ],
    "perfectionist/sort-union-types": [
        "warn",
        {
        },
    ],
};

// REF: https://www.npmjs.com/package/@antfu/eslint-config
/** @type {import("eslint-flat-config-utils").FlatConfigComposer<import("@antfu/eslint-config").TypedFlatConfigItem, import("@antfu/eslint-config").ConfigNames>} */
const config = antfu({
    stylistic: {
        indent: 4,
        quotes: "double",
        semi: true,
        overrides: {
            "style/indent-binary-ops": [
                "off",
                "tab",
            ],
            "style/arrow-parens": [
                "warn",
                "always",
            ],
            "style/no-trailing-spaces": [
                "warn",
                {
                    ignoreComments: true,
                },
            ],
            "style/linebreak-style": [
                "error",
                "unix",
            ],
        },
    },
    formatters: {
        css: "prettier",
        html: "prettier",
        xml: "prettier",
        markdown: "dprint",
        graphql: "prettier",
        prettierOptions: {
            tabWidth: 4,
            printWidth: Infinity,
            trailingComma: "all",
            bracketSameLine: false,
            singleAttributePerLine: true,
        },
    },
    yaml: {
        overrides: {
            "yaml/indent": [
                "error",
                2,
            ],
        },
    },
    jsonc: {
        overrides: {
            "jsonc/comma-dangle": [
                "warn",
                "only-multiline",
            ],
        },
    },
    typescript: {
        overrides: {
            ...rules,
        },
    },
    ignores: [
        "./dist",
        "./temp",
        "./pnpm-workspace.yaml",
    ],
}, {
    plugins: {
        tsdoc,
    },
    rules: {
        "tsdoc/syntax": "warn",
    },
    ignores: [
        GLOB_JS,
        GLOB_JSX,
    ],
});

export default config;
