import js_eslint from "@eslint/js";
import ts_eslint from "typescript-eslint";

// REF: https://eslint.nodejs.cn/docs/latest/use/configure/configuration-files-new
// REF: https://typescript-eslint.io/getting-started/#step-2-configuration
export default ts_eslint.config(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    js_eslint.configs.recommended,
    ts_eslint.configs.eslintRecommended,
    ...ts_eslint.configs.recommended,
    ...ts_eslint.configs.recommendedTypeChecked,
    ...[
        {
            ignores: [
                "./coverage/**",
                "./dist/**",
                "./node_modules/**",
                "./temp/**",
            ],
            languageOptions: {
                parserOptions: {
                    project: true,
                },
            },
            // REF https://eslint.nodejs.cn/docs/latest/rules/
            rules: {
                "no-empty": "warn",
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
