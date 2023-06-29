# 更改日志 | Change Log

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

