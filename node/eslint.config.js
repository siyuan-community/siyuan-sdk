import js_eslint from "@eslint/js";
import ts_eslint from "typescript-eslint";

// REF: https://eslint.nodejs.cn/docs/latest/use/configure/configuration-files-new
// REF: https://typescript-eslint.io/getting-started/#step-2-configuration
export default ts_eslint.config(
    js_eslint.configs.recommended,
    ...ts_eslint.configs.recommended,
    ...[
        {
            ignores: [
                "./coverage/**",
                "./dist/**",
                "./node_modules/**",
                "./temp/**",
            ],
            // REF https://eslint.nodejs.cn/docs/latest/rules/
            rules: {
                "no-empty": "off",
                "no-case-declarations": "off",
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/no-unused-vars": [
                    "error",
                    {
                        args: "all",
                        argsIgnorePattern: "^_",
                        caughtErrors: "all",
                        caughtErrorsIgnorePattern: "^_",
                        destructuredArrayIgnorePattern: "^_",
                        varsIgnorePattern: "^_",
                        ignoreRestSiblings: true,
                    },
                ],
            },
        },
    ],
);
