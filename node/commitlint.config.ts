// REF: https://commitlint.js.org/reference/configuration.html

import {
    RuleConfigSeverity,

} from "@commitlint/types";

import type { UserConfig } from "@commitlint/types";

const Configuration = {
    extends: [
        "@commitlint/config-conventional",
    ],
    rules: {
        "header-max-length": [
            RuleConfigSeverity.Warning,
            "always",
            72,
        ],
        "body-max-line-length": [
            RuleConfigSeverity.Warning,
            "always",
            100,
        ],
    },
} satisfies UserConfig;

export default Configuration;
