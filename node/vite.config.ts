/// <reference types="vitest" />

import { resolve } from "node:path";

import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    base: `./`,
    plugins: [
        // REF: https://www.npmjs.com/package/vite-tsconfig-paths
        tsconfigPaths(),
        // REF https://github.com/qmhc/vite-plugin-dts/blob/HEAD/README.zh-CN.md
        dts({
            insertTypesEntry: true,
            include: [
                "./src",
            ],
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
                    dest: "./",
                },
            ],
        }),
    ],
    build: {
        outDir: "./dist",
        sourcemap: true,
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
        dir: "tests",
        include: [
            "**/*.{test,spec}.?(c|m)[jt]s?(x)",
        ],
        api: 1204,
        testTimeout: 60_000,
        fileParallelism: false,
        // poolOptions: {
        //     threads: {
        //         singleThread: true,
        //     },
        // },
        coverage: {
            // provider: "v8",
            provider: "istanbul",
            // REF: https://istanbul.js.org/docs/advanced/alternative-reporters/
            reporter: [
                "clover", // coverage/clover.xml
                "cobertura", // coverage/cobertura-coverage.xml
                // "html", // HTML report
                "json-summary", // coverage/coverage-summary.json
                "json", // coverage/coverage-final.json
                // "lcov", // lcovonly + HTML report
                "lcovonly", // coverage/lcov.info
                // "none", // none report
                // "teamcity", // output to terminal
                // "text-lcov", // output to terminal
                // "text-summary", // output to terminal
                "text", // output to terminal
            ],
        },
    },
});
