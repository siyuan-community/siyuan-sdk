/// <reference types="vitest" />

import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    base: `./`,
    plugins: [
    ],
    resolve: {
        alias: {
            "@schemas": resolve(__dirname, "./../schemas"),
            "~": resolve(__dirname, "./"),
            "@": resolve(__dirname, "./src"),
        }
    },
    test: {
        include: [
            "**/tests/**/*.test.js",
            "**/tests/**/*.test.ts",
        ],
        testTimeout: 10000,
    },
});
