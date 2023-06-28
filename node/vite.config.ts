/// <reference types="vitest" />

import { resolve } from "path";

import { defineConfig } from "vitest/config";
import { viteStaticCopy } from 'vite-plugin-static-copy'
import dts from 'vite-plugin-dts'

export default defineConfig({
    base: `./`,
    resolve: {
        alias: {
            "@schemas": resolve(__dirname, "./../schemas"),
            "~": resolve(__dirname, "./"),
            "@": resolve(__dirname, "./src"),
        }
    },
    plugins: [
        // REF https://github.com/qmhc/vite-plugin-dts/blob/HEAD/README.zh-CN.md
        dts({
            insertTypesEntry: true,
        }),
        // REF https://www.npmjs.com/package/vite-plugin-static-copy
        viteStaticCopy({
            targets: [
                {
                    src: "./../schemas/",
                    dest: "./",
                },
                {
                    src: "./src/types/",
                    dest: "./src/",
                },
            ],
        }),
    ],
    build: {
        outDir: "./dist",
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "SiyuanSDK",
            fileName: "index",
            formats: [
                "es",
                "umd",
                // "cjs",
                "iife",
            ],
        },
    },
    test: {
        include: [
            "**/tests/**/*.test.js",
            "**/tests/**/*.test.ts",
        ],
        testTimeout: 10_000,
    },
});
