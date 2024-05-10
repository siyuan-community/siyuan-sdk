// @ts-check
import js_eslint from "@eslint/js";
import ts_eslint from 'typescript-eslint';

// REF: https://eslint.nodejs.cn/docs/latest/use/configure/configuration-files-new
// REF: https://typescript-eslint.io/getting-started/#step-2-configuration
export default ts_eslint.config(
    js_eslint.configs.recommended,
    ...ts_eslint.configs.recommended,
    ...[
        {
            ignores: [
                "./*.cjs",
                "./coverage/**",
                "./dist/**",
                "./node_modules/**",
                "./temp/**",
            ],
            // REF https://eslint.nodejs.cn/docs/latest/rules/
            rules: {
            },
        },
    ],
);
