import antfu from "@antfu/eslint-config";

export default antfu({
    stylistic: {
        indent: 4,
        quotes: "double",
        semi: true,
        arrowParens: true,
        quoteProps: "as-needed",
    },
    formatters: {
        css: "prettier",
        html: "prettier",
        markdown: "dprint",
        graphql: "prettier",
        prettierOptions: {
            tabWidth: 4,
            printWidth: 1024,
            trailingComma: "all",
            bracketSameLine: false,
            singleAttributePerLine: true,
        },
    },
    typescript: {
        overrides: {
            "import/order": ["off"],
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
                        [
                            "node",
                            "builtin",
                        ],
                        "external",
                        "repo",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                        "side-effect",
                        "unknown",
                        [
                            "node-type",
                            "builtin-type",
                        ],
                        "external-type",
                        "repo-type",
                        "internal-type",
                        "parent-type",
                        "sibling-type",
                        "index-type",
                        "type",

                        "style",
                        "side-effect-style",
                        "object",
                    ],
                    "custom-groups": {
                        value: {
                            node: "node:**",
                            repo: "@repo/**",
                        },
                        type: {
                            "node-style": "node:**",
                            "repo-style": "@repo/**",
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
});
