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
                "side-effect-style", // import "style.css";
                "side-effect", // import "module";

                [
                    "$node", // import path from "node:path";
                    "builtin", // import path from "path";
                ],
                "external", // import axios from "axios";
                [
                    "$repo", // import module from "@repo/module";
                    "$workspace", // import module from "@workspace/module";
                ],
                "$base", // import module from "~/module";
                "internal", // import module from "@/module";
                [
                    "$vue", // import Component from "Component.vue";
                    "$svelte", // import Component from "Component.svelte";
                ],
                [
                    "parent", // import module from "../module";
                    "sibling", // import module from "./module";
                    "index", // import module from ".";
                ],
                "unknown",

                [
                    "$node-type", // import type path from "node:path";
                    "builtin-type", // import type path from "path";
                ],
                "external-type", // import type axios from "axios";
                [
                    "$repo-type", // import type module from "@repo/module";
                    "$workspace-type", // import type module from "@workspace/module";
                ],
                "$base-type", // import type module from "~/module";
                "internal-type", // import type module from "@/module";
                [
                    "$vue-type", // import type Component from "Component.vue";
                    "$svelte-type", // import type Component from "Component.svelte";
                ],
                [
                    "parent-type", // import type module from "../module";
                    "sibling-type", // import type module from "./module";
                    "index-type", // import type module from ".";
                ],
                "type",

                "style", // import styles from "./index.module.css";
                "object", // import log = console.log;
            ],
            internalPattern: [
                "^@/.*",
            ],
            customGroups: {
                value: {
                    $node: "^node:.+",
                    $repo: "^@repo/.*",
                    $workspace: "^@workspace/.*",
                    $base: "^~/.*",
                    $vue: ".+\\.vue",
                    $svelte: ".+\\.svelte",
                },
                type: {
                    "$node-type": "^node:.+",
                    "$repo-type": "^@repo/.*",
                    "$workspace-type": "^@workspace/.*",
                    "$base-type": "^~/.*",
                    "$vue-type": ".+\\.vue",
                    "$svelte-type": ".+\\.svelte",
                },
            },
        },
    ],
    "perfectionist/sort-named-exports": [
        "warn",
        {
            groupKind: "values-first",
        },
    ],
    "perfectionist/sort-named-imports": [
        "warn",
        {
            groupKind: "values-first",
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
export default antfu({
    stylistic: {
        indent: 4,
        quotes: "double",
        semi: true,
        overrides: {
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
        markdown: "dprint",
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
