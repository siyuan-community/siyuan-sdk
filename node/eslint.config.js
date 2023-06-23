import js_plugin from "@eslint/js";
import ts_plugin from "@typescript-eslint/eslint-plugin";

import ts_parser from "@typescript-eslint/parser";

// REF https://eslint.nodejs.cn/docs/latest/use/configure/configuration-files-new
export default [
    {
        ignores: [
            "./build/**",
            "./dist/**",
            "./node_modules/**",
        ],
    },
    {
        $schema: "https://json.schemastore.org/eslintrc.json",
        files: [
            "**/*.js",
            "**/*.ts",
            "**/*.d.ts",
        ],
        languageOptions: {
            parser: ts_parser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        plugins: {
            "eslint:recommended": js_plugin,
            "@typescript-eslint": ts_plugin,
        },
        // REF https://eslint.nodejs.cn/docs/latest/rules/
        rules: {
        },
    },
];
