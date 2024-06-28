import antfu from "@antfu/eslint-config";

export default antfu(
    {
        stylistic: {
            indent: 4,
            quotes: "double",
            semi: true,
            arrowParens: true,
            quoteProps: "as-needed",
            overrides: {
                "style/arrow-parens": [
                    "warn",
                    "always",
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
        typescript: {
            overrides: {
                "import/order": ["off"],
                "ts/no-empty-object-type": [
                    "warn",
                    {
                        allowInterfaces: "with-single-extends",
                    },
                ],
                "style/arrow-parens": [
                    "warn",
                    "always",
                ],
                "perfectionist/sort-array-includes": [
                    "warn",
                    {
                        "spread-last": true,
                    },
                ],
                "perfectionist/sort-exports": [
                    "warn",
                    {},
                ],
                "perfectionist/sort-imports": [
                    "warn",
                    {
                        "groups": [
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
                            "$root", // import module from "~/module";
                            "internal", // import module from "@/module";
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
                            "$root-type", // import type module from "~/module";
                            "internal-type", // import type module from "@/module";
                            [
                                "parent-type", // import type module from "../module";
                                "sibling-type", // import type module from "./module";
                                "index-type", // import type module from ".";
                            ],
                            "type",

                            "style", // import styles from "./index.module.css";
                            "object", // import log = console.log;
                        ],
                        "internal-pattern": [
                            "@/**",
                        ],
                        "custom-groups": {
                            value: {
                                $node: "node:**",
                                $repo: "@repo/**",
                                $workspace: "@workspace/**",
                                $root: "~/**",
                            },
                            type: {
                                "$node-type": "node:**",
                                "$repo-type": "@repo/**",
                                "$workspace-type": "@workspace/**",
                                "$root-type": "~/**",
                            },
                        },
                    },
                ],
                "perfectionist/sort-named-exports": [
                    "warn",
                    {
                        "group-kind": "values-first",
                    },
                ],
                "perfectionist/sort-named-imports": [
                    "warn",
                    {
                        "group-kind": "values-first",
                        "ignore-alias": false,
                    },
                ],
                "perfectionist/sort-union-types": [
                    "warn",
                    {
                        "nullable-last": true,
                    },
                ],
            },
        },
        vue: {
            overrides: {
                "vue/attributes-order": [
                    "warn",
                    {
                        order: [
                            "DEFINITION",
                            "LIST_RENDERING",
                            "CONDITIONALS",
                            "RENDER_MODIFIERS",
                            "GLOBAL",
                            "UNIQUE",
                            "SLOT",
                            "TWO_WAY_BINDING",
                            "OTHER_DIRECTIVES",
                            "ATTR_DYNAMIC",
                            "ATTR_STATIC",
                            "ATTR_SHORTHAND_BOOL",
                            "EVENTS",
                            "CONTENT",
                        ],
                    },
                ],
                "vue/max-attributes-per-line": [
                    "warn",
                    {
                        singleline: {
                            max: 1,
                        },
                        multiline: {
                            max: 1,
                        },
                    },
                ],
            },
        },
        ignores: [
            "./coverage",
            "./dist",
            "./temp",
        ],
    },
);
