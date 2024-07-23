# 更改日志 | Change Log

- 调整 `tsconfig.json` 配置文件 | Adjust `tsconfig.json` configuration file
- 更新依赖版本 | Update dependency versions
- 调整 API `/api/system/getConf` | Adjust API `/api/notebook/getConf`
- 配置 `lint-staged` | Configure `lint-staged`

## v0.3.12 / 2024-07-11

- [v0.3.11 ... v0.3.12](https://github.com/siyuan-community/siyuan-sdk/compare/v0.3.11...v0.3.12)
- 改进 eslint 配置 | Improve eslint configuration
- 改进构建流程 | Improve the build process
- 优化 Prettier 配置 | Optimize Prettier configuration
- 添加 `Husky` 配置 | Add `Husky` configuration
- Prettier 支持排序模块导入 | Prettier supports sorting module imports
- Prettier 支持数组换行 | Prettier supports array line breaks
- 优化部分测试用例 | Optimize some test cases
- 添加 `.editorconfig` 配置 | Add `.editorconfig` configuration
- 添加 `tsdoc` 语法检查 | Add `tsdoc` syntax check
- 使用 `@antfu/eslint-config` 作为 eslint 基础配置 | Use `@antfu/eslint-config` as the basic eslint configuration
- 改进解析 `tsconfig.json` 中定义的路径别名的方式 | Improve the way to resolve path aliases defined in `tsconfig.json`
- 调整 `eslint` 格式化配置 | Adjust `eslint` formatting configuration
- 优化 `broadcast` 相关测试用例 | Optimize `broadcast` related test cases
- 调整 API `/api/system/getConf` | Adjust API `/api/notebook/getConf`
- 优化 TypeScript 类型定义生成脚本 | Optimize TypeScript type definition generation script

## v0.3.11 / 2024-05-14

- [v0.3.10 ... v0.3.11](https://github.com/siyuan-community/siyuan-sdk/compare/v0.3.10...v0.3.11)
- 排序 `import` 表达式 | Sort `import` expressions
- 完善社区资源清单文件定义 | Perfect community resource manifest file definition
- 完善 Prettier 配置并应用 | Perfect Prettier configuration and apply
- 重构 API 客户端配置更新机制 | Refactor API client configuration update mechanism
- 调整 API `/api/system/getConf` | Adjust API `/api/notebook/getConf`

## v0.3.10 / 2024-05-09

- [v0.3.9 ... v0.3.10](https://github.com/siyuan-community/siyuan-sdk/compare/v0.3.9...v0.3.10)
- 添加 API `/api/export/exportHTML` | Add API `/api/export/exportHTML`
- 调整 API `/api/export/exportHTML` | Adjust API `/api/export/exportHTML`
- 优化 WebSocket URL 生成方案 | Optimize WebSocket URL generation scheme
- 调整 API `/api/system/getConf` | Adjust API `/api/system/getConf`
- 调整 API `/api/notebook/getNotebookConf` | Adjust API `/api/notebook/getNotebookConf`
- 调整 API `/api/notebook/setNotebookConf` | Adjust API `/api/notebook/setNotebookConf`
- 调整 API `/api/system/getConf` | Adjust API `/api/notebook/getConf`
- 添加社区资源清单文件基本定义 | Add basic definition of community resource manifest file
- 添加图标资源清单文件定义 | Add icon resource manifest file definition
- 添加插件资源清单文件定义 | Add plugin resource manifest file definition
- 添加模板资源清单文件定义 | Add template resource manifest file definition
- 添加挂件资源清单文件定义 | Add widget resource manifest file definition
- 添加主题资源清单文件定义 | Add theme resource manifest file definition

## v0.3.9 / 2024-04-06

- [v0.3.8 ... v0.3.9](https://github.com/siyuan-community/siyuan-sdk/compare/v0.3.8...v0.3.9)
- 添加 API `/api/block/foldBlock` | Add API `/api/block/foldBlock`
- 添加 API `/api/block/unfoldBlock` | Add API `/api/block/unfoldBlock`
- 调整 API `/api/system/getConf` | Adjust API `/api/system/getConf`
- 调整 API `/api/search/fullTextSearchBlock` | Adjust API `/api/search/fullTextSearchBlock`
- 调整 API `/api/block/getDocInfo` | Adjust API `/api/block/getDocInfo`
- 添加 API `/api/system/exit` | Add API `/api/system/exit`
- 实现兼容 `Fetch` 接口的 `forwardProxy` 调用方案 | Implement a `forwardProxy` calling scheme compatible with the `Fetch` interface
- 优化 `$fetch` 中 HTTP 请求头格式转换方案 | Optimize the HTTP request header format conversion scheme in `$fetch`
- 调整 API `/api/system/getConf` | Adjust API `/api/system/getConf`

## v0.3.8 / 2024-03-19

- [v0.3.7 ... v0.3.8](https://github.com/siyuan-community/siyuan-sdk/compare/v0.3.7...v0.3.8)
- [#3](https://github.com/siyuan-community/siyuan-sdk/issues/3) 添加 API `/api/sqlite/flushTransaction` | Add API `/api/sqlite/flushTransaction`
- 添加 API `/api/system/logoutAuth` | Add API `/api/system/logoutAuth`
- 调整 API `/api/system/getConf` | Adjust API `/api/system/getConf`
- 完善 API `/api/system/getConf` | Perfect API `/api/system/getConf`
- 调整 API `/api/block/transferBlockRef` | Adjust API `/api/block/transferBlockRef`
- 调整 API `/api/filetree/listDocsByPath` 的测试用例 | Adjust the test cases of API `/api/filetree/listDocsByPath`
- 调整 API `/api/block/getDocInfo` | Adjust API `/api/block/getDocInfo`

## v0.3.7 / 2024-01-24

- [v0.3.6 ... v0.3.7](https://github.com/siyuan-community/siyuan-sdk/compare/v0.3.6...v0.3.7)
- 优化测试用例以兼容 Vitest `v1.x.x` | Optimize test cases to be compatible with Vitest `v1.x.x`
- 完善 API `/api/notebook/lsNotebooks` | Perfect API `/api/notebook/lsNotebooks`
- 调整 Vitest 配置 | Adjust Vitest configuration
- [#2](https://github.com/siyuan-community/siyuan-sdk/issues/2) 添加 API `/api/outline/getDocOutline` | Add API `/api/outline/getDocOutline`

## v0.3.6 / 2023-12-26

- [v0.3.5 ... v0.3.6](https://github.com/siyuan-community/siyuan-sdk/compare/v0.3.5...v0.3.6)
- 调整 API `/api/inbox/getShorthand` | Adjust API `/api/inbox/getShorthand`
- 调整 API `/api/system/getConf` | Adjust API `/api/system/getConf`
- 添加 API `/api/filetree/createDailyNote` | Add API `/api/filetree/createDailyNote`
- 完善 API `/api/system/getConf` | Perfect API `/api/system/getConf`

## v0.3.5 / 2023-11-28

- [v0.3.4 ... v0.3.5](https://github.com/siyuan-community/siyuan-sdk/compare/v0.3.4...v0.3.5)
- 删除 API `/api/broadcast/channels` | Delete API `/api/broadcast/channels`
- 添加 API `/api/broadcast/getChannels` | Add API `/api/broadcast/getChannels`
- 添加 API `/api/network/echo` | Add API `/api/network/echo`
- 调整 API `/api/storage/getRecentDocs` 的 JSON Schema | Adjust the JSON Schema of API `/api/storage/getRecentDocs`

## v0.3.4 / 2023-11-15

- [v0.3.3 ... v0.3.4](https://github.com/siyuan-community/siyuan-sdk/compare/v0.3.3...v0.3.4)
- 添加 API `/api/storage/setLocalStorageVal` | Add API `/api/storage/setLocalStorageVal`
- 为 API `/api/file/getFile` 的 `blob` 响应结果添加 `content-type` | Add `content-type` to the `blob` response result of API `/api/file/getFile`
- [#1](https://github.com/siyuan-community/siyuan-sdk/issues/1) 添加 API `/api/filetree/getIDsByHPath` | Add API `/api/filetree/getIDsByHPath`
- 调整 API `/api/snippet/getSnippet` | Adjust API `/api/snippet/getSnippet`

## v0.3.3 / 2023-10-24

- [v0.3.2 ... v0.3.3](https://github.com/siyuan-community/siyuan-sdk/compare/v0.3.2...v0.3.3)
- 自定义常量联合类型定义名 | Custom constant union type definition name
- 添加 API `/api/system/getConf` | Add API `/api/system/getConf`
- 完善 API `/api/system/getConf` | Perfect API `/api/system/getConf`
- 添加 API `/api/storage/getLocalStorage` | Add API `/api/storage/getLocalStorage`
- 添加 API `/api/storage/setLocalStorage` | Add API `/api/storage/setLocalStorage`

## v0.3.2 / 2023-09-19

- [v0.3.1 ... v0.3.2](https://github.com/siyuan-community/siyuan-sdk/compare/v0.3.1...v0.3.2)
- 修复拼写错误 | Fix spelling errors
- 更新 API JSON Schemas | Update API JSON Schemas

## v0.3.1 / 2023-09-12

- [v0.3.0 ... v0.3.1](https://github.com/siyuan-community/siyuan-sdk/compare/v0.3.0...v0.3.1)
- 更新 API `/api/filetree/listDocsByPath` | Update API `/api/filetree/listDocsByPath`
- 添加 `#region content` 标识 | Add `#region content` mark
- 添加 API `/api/search/fullTextSearchBlock` | Add API `/api/search/fullTextSearchBlock`

## v0.3.0 / 2023-09-05

- [v0.2.3 ... v0.3.0](https://github.com/siyuan-community/siyuan-sdk/compare/v0.2.3...v0.3.0)
- 优化 API `/api/file/getFile` | Optimize API `/api/file/getFile`
- 添加思源文件系统管理接口 | Add SiYuan file system management interface
- 优化 API `/ws/broadcast` | Optimize API `/ws/broadcast`
- 改进 API `/api/network/forwardProxy` | Improve API `/api/network/forwardProxy`

## v0.2.3 / 2023-08-29

- [v0.2.2 ... v0.2.3](https://github.com/siyuan-community/siyuan-sdk/compare/v0.2.2...v0.2.3)
- 添加 API `/api/broadcast/channels` | Add API `/api/broadcast/channels`
- 添加 API `/api/broadcast/getChannelInfo` | Add API `/api/broadcast/getChannelInfo`
- 添加 API `/api/broadcast/postMessage` | Add API `/api/broadcast/postMessage`
- 添加 API `/ws/broadcast` | Add API `/ws/broadcast`

## v0.2.2 / 2023-08-16

- [v0.2.1 ... v0.2.2](https://github.com/siyuan-community/siyuan-sdk/compare/v0.2.1...v0.2.2)
- 更新 API `/api/file/readDir` | Update API `/api/file/readDir`
- 添加 API `/api/storage/getRecentDocs` | Add API `/api/storage/getRecentDocs`
- 添加 API `/api/filetree/searchDocs` | Add API `/api/filetree/searchDocs`

## v0.2.1 / 2023-08-11

- [v0.2.0 ... v0.2.1](https://github.com/siyuan-community/siyuan-sdk/compare/v0.2.0...v0.2.1)
- 调整默认 `baseURL` | Adjust default `baseURL`
- 添加 API `/api/filetree/listDocsByPath` | Add API `/api/filetree/listDocsByPath`
- 优化部分测试用例 | Optimize some test cases
- 添加 API `/api/attr/getBookmarkLabels` | Add API `/api/attr/getBookmarkLabels`
- 添加 API `/api/block/getDocInfo` | Add API `/api/block/getDocInfo`

## v0.2.0 / 2023-08-01

- [v0.1.3 ... v0.2.0](https://github.com/siyuan-community/siyuan-sdk/compare/v0.1.3...v0.2.0)
- 添加 API `/api/export/exportResources` | Add API `/api/export/exportResources`
- API `/api/file/getFile` 支持流式传输 | API `/api/file/getFile` supports streaming transmission
- 支持使用 `ofetch` 作为 HTTP 请求客户端 | Support using `ofetch` as HTTP request client
- API `/api/file/getFile` 提供响应类型定义 | API `/api/file/getFile` provides response type definition

## v0.1.3 / 2023-07-27

- [v0.1.2 ... v0.1.3](https://github.com/siyuan-community/siyuan-sdk/compare/v0.1.2...v0.1.3)
- API `/api/file/getFile` 支持自定义响应类型 | API `/api/file/getFile` supports custom response types
- 添加 API `/api/inbox/getShorthand` | Add API `/api/inbox/getShorthand`
- 添加 API `/api/history/getDocHistoryContent` | Add API `/api/history/getDocHistoryContent`
- 添加 API `/api/history/getHistoryItems` | Add API `/api/history/getHistoryItems`
- 添加 API `/api/repo/openRepoSnapshotDoc` | Add API `/api/repo/openRepoSnapshotDoc`

## v0.1.2 / 2023-07-26

- [v0.1.1 ... v0.1.2](https://github.com/siyuan-community/siyuan-sdk/compare/v0.1.1...v0.1.2)
- 更新 API `/api/file/readDir` | Update API `/api/file/readDir`
- 添加 API `/api/snippet/setSnippet` | Add API `/api/snippet/setSnippet`
- 添加 API `/api/snippet/getSnippet` | Add API `/api/snippet/getSnippet`

## v0.1.1 / 2023-07-18

- [v0.1.0 ... v0.1.1](https://github.com/siyuan-community/siyuan-sdk/compare/v0.1.0...v0.1.1)
- 添加 API `/api/filetree/getHPathByID` | Add API `/api/filetree/getHPathByID`
- schema ID 更改为 `https://github.com/:user/:repo/raw/:branch/*` | Change schema ID to `https://github.com/:user/:repo/raw/:branch/*`
- 更新 API `/api/filetree/getHPathByID` | Update API `/api/filetree/getHPathByID`
- 添加 API `/api/filetree/getDoc` | Add API `/api/filetree/getDoc`
- 添加 API `/api/block/getBlockDOM` | Add API `/api/block/getBlockDOM`
- 添加 API `/api/block/getBlockBreadcrumb` | Add API `/api/block/getBlockBreadcrumb`
- 添加 API `/api/block/getBlockInfo` | Add API `/api/block/getBlockInfo`

## v0.1.0 / 2023-07-02

- [v0.0.6 ... v0.1.0](https://github.com/siyuan-community/siyuan-sdk/compare/v0.0.6...v0.1.0)
- 更新文档 | Update document
- 更新依赖 | Update dependencies
- 优化 JSON Schema 描述 | Optimize JSON Schema description

## v0.0.6 / 2023-07-01

- [v0.0.5 ... v0.0.6](https://github.com/siyuan-community/siyuan-sdk/compare/v0.0.5...v0.0.6)
- 添加 API `/api/filetree/createDocWithMd` | Add API `/api/filetree/createDocWithMd`
- 添加 API `/api/filetree/renameDoc` | Add API `/api/filetree/renameDoc`
- 添加 API `/api/filetree/removeDoc` | Add API `/api/filetree/removeDoc`
- 添加 API `/api/filetree/getHPathByPath` | Add API `/api/filetree/getHPathByPath`
- 添加 API `/api/filetree/getHPathByID` | Add API `/api/filetree/getHPathByID`
- 添加 API `/api/filetree/moveDocs` | Add API `/api/filetree/moveDocs`
- 添加 API `/api/asset/upload` | Add API `/api/asset/upload`
- 添加 API `/api/block/getChildBlocks` | Add API `/api/block/getChildBlocks`
- 添加 API `/api/block/getBlockKramdown` | Add API `/api/block/getBlockKramdown`
- 添加 API `/api/block/insertBlock` | Add API `/api/block/insertBlock`
- 添加 API `/api/block/prependBlock` | Add API `/api/block/prependBlock`
- 添加 API `/api/block/appendBlock` | Add API `/api/block/appendBlock`
- 添加 API `/api/block/updateBlock` | Add API `/api/block/updateBlock`
- 添加 API `/api/block/deleteBlock` | Add API `/api/block/deleteBlock`
- 添加 API `/api/block/moveBlock` | Add API `/api/block/moveBlock`
- 添加 API `/api/block/transferBlockRef` | Add API `/api/block/transferBlockRef`

## v0.0.5 / 2023-06-30

- [v0.0.4 ... v0.0.5](https://github.com/siyuan-community/siyuan-sdk/compare/v0.0.4...v0.0.5)
- 修复构建时类型导出问题 | Fix the issue of type exporting problem when building
- 优化开发模式脚本 | Optimize development mode script
- 添加 API `/api/query/sql` | Add API `/api/query/sql`
- 添加 API `/api/query/sql` 测试文件 | Add API `/api/query/sql` test file
- 添加 API `/api/attr/getBlockAttrs` | Add API `/api/attr/getBlockAttrs`
- 添加 API `/api/attr/setBlockAttrs` | Add API `/api/attr/setBlockAttrs`
- 添加 API `/api/notebook/lsNotebooks` | Add API `/api/notebook/lsNotebooks`
- 添加 API `/api/notebook/getNotebookConf` | Add API `/api/notebook/getNotebookConf`
- 添加 API `/api/notebook/closeNotebook` | Add API `/api/notebook/closeNotebook`
- 添加 API `/api/notebook/openNotebook` | Add API `/api/notebook/openNotebook`
- 添加 API `/api/notebook/renameNotebook` | Add API `/api/notebook/renameNotebook`
- 添加 API `/api/notebook/createNotebook` | Add API `/api/notebook/createNotebook`
- 添加 API `/api/notebook/removeNotebook` | Add API `/api/notebook/removeNotebook`
- 添加 API `/api/notebook/setNotebookConf` | Add API `/api/notebook/setNotebookConf`
- 优化 API `/api/notebook/*` 测试用例 | Optimize API `/api/notebook/*` test cases

## v0.0.4 / 2023-06-29

- [v0.0.3 ... v0.0.4](https://github.com/siyuan-community/siyuan-sdk/compare/v0.0.3...v0.0.4)
- 添加 API `/api/template/renderSprig` | Add API `/api/template/renderSprig`
- 添加 API `/api/template/render` | Add API `/api/template/render`

## v0.0.3 / 2023-06-29

- [v0.0.2 ... v0.0.3](https://github.com/siyuan-community/siyuan-sdk/compare/v0.0.2...v0.0.3)
- JSON Schema 中使用 `$defs` 属性替换 `definitions` 属性 | Use `$defs` property in JSON Schema to replace `definitions` property
  - REF: https://json-schema.org/draft/2020-12/schema
- 添加 API `/api/file/readDir` | Add API `/api/file/readDir`
- API `/api/convert/pandoc` 兼容思源版本 `v2.9.3` | API `/api/convert/pandoc` is compatible with SiYuan version `v2.9.3`
- 添加 API `/api/file/getFile` | Add API `/api/file/getFile`
- 添加 API `/api/file/putFile` | Add API `/api/file/putFile`
- 优化 API `/api/convert/pandoc` 测试 | Optimize API `/api/convert/pandoc` test
- 添加 API `/api/file/removeFile` | Add API `/api/file/removeFile`
- 添加 API `/api/file/renameFile` | Add API `/api/file/renameFile`
- 优化 API `/api/file/*` 测试用例 | Optimize API `/api/file/*` test cases

## v0.0.2 / 2023-06-26

- [v0.0.1 ... v0.0.2](https://github.com/siyuan-community/siyuan-sdk/compare/v0.0.1...v0.0.2)
- 添加 API `/api/system/currentTime` | Add API `/api/system/currentTime`
- 为配置文件添加 `$schema` | Add `$schema` for configuration file
- 优化 API 测试 | Optimize API test
- 添加 API `/api/system/bootProgress` | Add API `/api/system/bootProgress`
- 添加开发模式 | Add development mode
- 添加 API `/api/notification/pushMsg` | Add API `/api/notification/pushMsg`
- 添加 API `/api/notification/pushErrMsg` | Add API `/api/notification/pushErrMsg`
- 使用 [axios](https://www.npmjs.com/package/axios) 作为 HTTP 客户端 | Use [axios](https://www.npmjs.com/package/axios) as HTTP client
- 添加 API `/api/convert/pandoc` | Add API `/api/convert/pandoc`
- 完善测试时对运行时异常的处理 | Improve the handling of runtime exceptions during testing
- 添加 API `/api/export/exportMdContent` | Add API `/api/export/exportMdContent`

## v0.0.1 / 2023-06-23

- 初始化项目 | Initialize project
- API 测试支持使用 JSON Schema 校验响应体 | API test supports using JSON Schema to verify response body
- 调整构建配置项 | Adjust build configuration items
- 调整文件目录结构 | Adjust file directory structure
- 配置构建选项 | Configure build options
- 配置 npm 发布选项 | Configure npm release options
