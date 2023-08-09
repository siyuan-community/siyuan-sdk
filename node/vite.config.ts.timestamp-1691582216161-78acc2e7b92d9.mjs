// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "file:///D:/Sync/GitHub/siyuan-sdk/node/node_modules/.pnpm/vitest@0.32.4_@vitest+ui@0.33.0/node_modules/vitest/dist/config.js";
import { viteStaticCopy } from "file:///D:/Sync/GitHub/siyuan-sdk/node/node_modules/.pnpm/vite-plugin-static-copy@0.16.0_vite@4.4.7/node_modules/vite-plugin-static-copy/dist/index.js";
import dts from "file:///D:/Sync/GitHub/siyuan-sdk/node/node_modules/.pnpm/vite-plugin-dts@3.4.0_@types+node@20.4.5_typescript@5.1.6_vite@4.4.7/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\Sync\\GitHub\\siyuan-sdk\\node";
var vite_config_default = defineConfig({
  base: `./`,
  resolve: {
    alias: {
      "@schemas": resolve(__vite_injected_original_dirname, "./../schemas"),
      "~": resolve(__vite_injected_original_dirname, "./"),
      "@": resolve(__vite_injected_original_dirname, "./src")
    }
  },
  plugins: [
    // REF https://github.com/qmhc/vite-plugin-dts/blob/HEAD/README.zh-CN.md
    dts({
      insertTypesEntry: true,
      include: [
        "./src"
      ]
    }),
    // REF https://www.npmjs.com/package/vite-plugin-static-copy
    viteStaticCopy({
      targets: [
        {
          src: "./../schemas/",
          dest: "./"
        },
        {
          src: "./src/types/",
          dest: "./"
        }
      ]
    })
  ],
  build: {
    outDir: "./dist",
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "SiyuanSDK",
      fileName: "index",
      formats: [
        "es",
        "umd",
        // "cjs",
        "iife"
      ]
    }
  },
  test: {
    include: [
      "**/tests/**/*.test.js",
      "**/tests/**/*.test.ts"
    ],
    testTimeout: 6e4,
    coverage: {
      // provider: "v8",
      provider: "istanbul",
      // REF: https://istanbul.js.org/docs/advanced/alternative-reporters/
      reporter: [
        "clover",
        // coverage/clover.xml
        "cobertura",
        // coverage/cobertura-coverage.xml
        // "html", // HTML report
        "json-summary",
        // coverage/coverage-summary.json
        "json",
        // coverage/coverage-final.json
        // "lcov", // lcovonly + HTML report
        "lcovonly",
        // coverage/lcov.info
        // "none", // none report
        // "teamcity", // output to terminal
        // "text-lcov", // output to terminal
        // "text-summary", // output to terminal
        "text"
        // output to terminal
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxTeW5jXFxcXEdpdEh1YlxcXFxzaXl1YW4tc2RrXFxcXG5vZGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFN5bmNcXFxcR2l0SHViXFxcXHNpeXVhbi1zZGtcXFxcbm9kZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovU3luYy9HaXRIdWIvc2l5dWFuLXNkay9ub2RlL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxyXG5cclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZXN0L2NvbmZpZ1wiO1xyXG5pbXBvcnQgeyB2aXRlU3RhdGljQ29weSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN0YXRpYy1jb3B5J1xyXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgICBiYXNlOiBgLi9gLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgICAgIFwiQHNjaGVtYXNcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi8uLi9zY2hlbWFzXCIpLFxyXG4gICAgICAgICAgICBcIn5cIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9cIiksXHJcbiAgICAgICAgICAgIFwiQFwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICAgIC8vIFJFRiBodHRwczovL2dpdGh1Yi5jb20vcW1oYy92aXRlLXBsdWdpbi1kdHMvYmxvYi9IRUFEL1JFQURNRS56aC1DTi5tZFxyXG4gICAgICAgIGR0cyh7XHJcbiAgICAgICAgICAgIGluc2VydFR5cGVzRW50cnk6IHRydWUsXHJcbiAgICAgICAgICAgIGluY2x1ZGU6IFtcclxuICAgICAgICAgICAgICAgIFwiLi9zcmNcIixcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9KSxcclxuICAgICAgICAvLyBSRUYgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2Uvdml0ZS1wbHVnaW4tc3RhdGljLWNvcHlcclxuICAgICAgICB2aXRlU3RhdGljQ29weSh7XHJcbiAgICAgICAgICAgIHRhcmdldHM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzcmM6IFwiLi8uLi9zY2hlbWFzL1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3Q6IFwiLi9cIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3JjOiBcIi4vc3JjL3R5cGVzL1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3Q6IFwiLi9cIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfSksXHJcbiAgICBdLFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgICBvdXREaXI6IFwiLi9kaXN0XCIsXHJcbiAgICAgICAgbGliOiB7XHJcbiAgICAgICAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvaW5kZXgudHNcIiksXHJcbiAgICAgICAgICAgIG5hbWU6IFwiU2l5dWFuU0RLXCIsXHJcbiAgICAgICAgICAgIGZpbGVOYW1lOiBcImluZGV4XCIsXHJcbiAgICAgICAgICAgIGZvcm1hdHM6IFtcclxuICAgICAgICAgICAgICAgIFwiZXNcIixcclxuICAgICAgICAgICAgICAgIFwidW1kXCIsXHJcbiAgICAgICAgICAgICAgICAvLyBcImNqc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJpaWZlXCIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB0ZXN0OiB7XHJcbiAgICAgICAgaW5jbHVkZTogW1xyXG4gICAgICAgICAgICBcIioqL3Rlc3RzLyoqLyoudGVzdC5qc1wiLFxyXG4gICAgICAgICAgICBcIioqL3Rlc3RzLyoqLyoudGVzdC50c1wiLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgdGVzdFRpbWVvdXQ6IDYwXzAwMCxcclxuICAgICAgICBjb3ZlcmFnZToge1xyXG4gICAgICAgICAgICAvLyBwcm92aWRlcjogXCJ2OFwiLFxyXG4gICAgICAgICAgICBwcm92aWRlcjogXCJpc3RhbmJ1bFwiLFxyXG4gICAgICAgICAgICAvLyBSRUY6IGh0dHBzOi8vaXN0YW5idWwuanMub3JnL2RvY3MvYWR2YW5jZWQvYWx0ZXJuYXRpdmUtcmVwb3J0ZXJzL1xyXG4gICAgICAgICAgICByZXBvcnRlcjogW1xyXG4gICAgICAgICAgICAgICAgXCJjbG92ZXJcIiwgLy8gY292ZXJhZ2UvY2xvdmVyLnhtbFxyXG4gICAgICAgICAgICAgICAgXCJjb2JlcnR1cmFcIiwgLy8gY292ZXJhZ2UvY29iZXJ0dXJhLWNvdmVyYWdlLnhtbFxyXG4gICAgICAgICAgICAgICAgLy8gXCJodG1sXCIsIC8vIEhUTUwgcmVwb3J0XHJcbiAgICAgICAgICAgICAgICBcImpzb24tc3VtbWFyeVwiLCAvLyBjb3ZlcmFnZS9jb3ZlcmFnZS1zdW1tYXJ5Lmpzb25cclxuICAgICAgICAgICAgICAgIFwianNvblwiLCAvLyBjb3ZlcmFnZS9jb3ZlcmFnZS1maW5hbC5qc29uXHJcbiAgICAgICAgICAgICAgICAvLyBcImxjb3ZcIiwgLy8gbGNvdm9ubHkgKyBIVE1MIHJlcG9ydFxyXG4gICAgICAgICAgICAgICAgXCJsY292b25seVwiLCAvLyBjb3ZlcmFnZS9sY292LmluZm9cclxuICAgICAgICAgICAgICAgIC8vIFwibm9uZVwiLCAvLyBub25lIHJlcG9ydFxyXG4gICAgICAgICAgICAgICAgLy8gXCJ0ZWFtY2l0eVwiLCAvLyBvdXRwdXQgdG8gdGVybWluYWxcclxuICAgICAgICAgICAgICAgIC8vIFwidGV4dC1sY292XCIsIC8vIG91dHB1dCB0byB0ZXJtaW5hbFxyXG4gICAgICAgICAgICAgICAgLy8gXCJ0ZXh0LXN1bW1hcnlcIiwgLy8gb3V0cHV0IHRvIHRlcm1pbmFsXHJcbiAgICAgICAgICAgICAgICBcInRleHRcIiwgLy8gb3V0cHV0IHRvIHRlcm1pbmFsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBRUEsU0FBUyxlQUFlO0FBRXhCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsc0JBQXNCO0FBQy9CLE9BQU8sU0FBUztBQU5oQixJQUFNLG1DQUFtQztBQVF6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxZQUFZLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQzdDLEtBQUssUUFBUSxrQ0FBVyxJQUFJO0FBQUEsTUFDNUIsS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUNuQztBQUFBLEVBQ0o7QUFBQSxFQUNBLFNBQVM7QUFBQTtBQUFBLElBRUwsSUFBSTtBQUFBLE1BQ0Esa0JBQWtCO0FBQUEsTUFDbEIsU0FBUztBQUFBLFFBQ0w7QUFBQSxNQUNKO0FBQUEsSUFDSixDQUFDO0FBQUE7QUFBQSxJQUVELGVBQWU7QUFBQSxNQUNYLFNBQVM7QUFBQSxRQUNMO0FBQUEsVUFDSSxLQUFLO0FBQUEsVUFDTCxNQUFNO0FBQUEsUUFDVjtBQUFBLFFBQ0E7QUFBQSxVQUNJLEtBQUs7QUFBQSxVQUNMLE1BQU07QUFBQSxRQUNWO0FBQUEsTUFDSjtBQUFBLElBQ0osQ0FBQztBQUFBLEVBQ0w7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNILFFBQVE7QUFBQSxJQUNSLEtBQUs7QUFBQSxNQUNELE9BQU8sUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDeEMsTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLE1BQ1YsU0FBUztBQUFBLFFBQ0w7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUVBO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDRixTQUFTO0FBQUEsTUFDTDtBQUFBLE1BQ0E7QUFBQSxJQUNKO0FBQUEsSUFDQSxhQUFhO0FBQUEsSUFDYixVQUFVO0FBQUE7QUFBQSxNQUVOLFVBQVU7QUFBQTtBQUFBLE1BRVYsVUFBVTtBQUFBLFFBQ047QUFBQTtBQUFBLFFBQ0E7QUFBQTtBQUFBO0FBQUEsUUFFQTtBQUFBO0FBQUEsUUFDQTtBQUFBO0FBQUE7QUFBQSxRQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBS0E7QUFBQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
