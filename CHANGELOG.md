# 更改日志 | Change Log

- API `/api/file/getFile` 支持自定义响应类型 | API `/api/file/getFile` supports custom response types
- 添加 API `/api/inbox/getShorthand` | Add API `/api/inbox/getShorthand`

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

