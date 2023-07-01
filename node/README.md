<div align="center">

<h1>SiYuan SDK</h1>

<!-- 仓库相关 -->
[![GitHub LICENSE](https://img.shields.io/github/license/siyuan-community/siyuan-sdk?style=flat-square)](https://github.com/siyuan-community/siyuan-sdk/blob/main/LICENSE)
[![GitHub repo size](https://img.shields.io/github/repo-size/siyuan-community/siyuan-sdk?style=flat-square)](https://github.com/siyuan-community/siyuan-sdk)
[![GitHub code size](https://img.shields.io/github/languages/code-size/siyuan-community/siyuan-sdk)](https://github.com/siyuan-community/siyuan-sdk)
[![GitHub commits](https://img.shields.io/github/commit-activity/t/siyuan-community/siyuan-sdk?style=flat-square)](https://github.com/siyuan-community/siyuan-sdk/commits/main)
[![GitHub latest commit](https://img.shields.io/github/last-commit/siyuan-community/siyuan-sdk?style=flat-square)](https://github.com/siyuan-community/siyuan-sdk/commits/main)
![Hits](https://hits.b3log.org/siyuan-community/siyuan-sdk.svg)
<br/>

<!-- GitHub 相关 -->
<!-- [![GitHub stargazers](https://img.shields.io/github/stars/siyuan-community/siyuan-sdk?style=flat-square)](https://github.com/siyuan-community/siyuan-sdk/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/siyuan-community/siyuan-sdk?style=flat-square)](https://github.com/siyuan-community/siyuan-sdk/forks)
[![GitHub watchers](https://img.shields.io/github/watchers/siyuan-community/siyuan-sdk?style=flat-square)](https://github.com/siyuan-community/siyuan-sdk/watchers)
[![GitHub issues](https://img.shields.io/github/issues-raw/siyuan-community/siyuan-sdk?style=flat-square)](https://github.com/siyuan-community/siyuan-sdk/issues)
[![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/siyuan-community/siyuan-sdk?style=flat-square)](https://github.com/siyuan-community/siyuan-sdk/issues?q=is%3Aissue+is%3Aclosed)
[![GitHub pull request](https://img.shields.io/github/issues-pr-raw/siyuan-community/siyuan-sdk?style=flat-square)](https://github.com/siyuan-community/siyuan-sdk/pulls)
[![GitHub closed pull request](https://img.shields.io/github/issues-pr-closed-raw/siyuan-community/siyuan-sdk?style=flat-square)](https://github.com/siyuan-community/siyuan-sdk/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub latest release](https://img.shields.io/github/v/release/siyuan-community/siyuan-sdk?include_prereleases&style=flat-square)](https://github.com/siyuan-community/siyuan-sdk/releases/latest)
[![GitHub latest release time](https://img.shields.io/github/release-date/siyuan-community/siyuan-sdk?style=flat-square)](https://github.com/siyuan-community/siyuan-sdk/releases/latest)
[![GitHub downloads](https://img.shields.io/github/downloads/siyuan-community/siyuan-sdk/total?style=flat-square)](https://github.com/siyuan-community/siyuan-sdk/releases)
<br/> -->

<!-- NPM 相关 -->
[![NPM version](https://img.shields.io/npm/v/%40siyuan-community/siyuan-sdk?style=flat-square)](https://www.npmjs.com/package/@siyuan-community/siyuan-sdk?activeTab=versions)
[![NPM dependents (via libraries.io)](https://img.shields.io/librariesio/dependents/npm/%40siyuan-community/siyuan-sdk?style=flat-square)](https://www.npmjs.com/package/@siyuan-community/siyuan-sdk?activeTab=dependents)
[![NPM type definition](https://img.shields.io/npm/types/%40siyuan-community/siyuan-sdk?style=flat-square)](https://www.npmjs.com/package/@siyuan-community/siyuan-sdk)
[![NPM downloads](https://img.shields.io/npm/dt/%40siyuan-community/siyuan-sdk?style=flat-square)](https://www.npmjs.com/package/@siyuan-community/siyuan-sdk)
[![NPM downloads (yearly)](https://img.shields.io/npm/dy/%40siyuan-community/siyuan-sdk?style=flat-square)](https://www.npmjs.com/package/@siyuan-community/siyuan-sdk)
[![NPM downloads (monthly)](https://img.shields.io/npm/dm/%40siyuan-community/siyuan-sdk?style=flat-square)](https://www.npmjs.com/package/@siyuan-community/siyuan-sdk)
[![NPM downloads (weekly)](https://img.shields.io/npm/dw/%40siyuan-community/siyuan-sdk?style=flat-square)](https://www.npmjs.com/package/@siyuan-community/siyuan-sdk)

---
[简体中文](./README-zh-Hans.md) \| **English**

---
</div>

> A simple and easy to use SDK for [SiYuan Note](https://github.com/siyuan-note/siyuan).

- [Getting Started](#getting-started)
  - [Installation](#installation)
- [Examples](#examples)
  - [Initialize the client](#initialize-the-client)
  - [Update client configuration](#update-client-configuration)
  - [Call Kernel API (async)](#call-kernel-api-async)
  - [Call Kernel API (Promise)](#call-kernel-api-promise)
  - [Use type definitions](#use-type-definitions)
- [References](#references)
  - [API References](#api-references)
- [Changelog](#changelog)

## Getting Started

### Installation

Using npm:

```bash
$ npm install @siyuan-community/siyuan-sdk
```

Using pnpm:

```bash
$ pnpm i @siyuan-community/siyuan-sdk
```

Using yarn:

```bash
$ yarn add @siyuan-community/siyuan-sdk
```

## Examples

### Initialize the client

```javascript
import { Client } from "siyuan-sdk";

/* Initialize the client */
const client = new Client({
    /**
     * (Optional) SiYuan kernel service URL
     * @default: document.baseURI
     */
    baseURL: "http://localhost:6806/",

    /**
     * (Optional) SiYuan kernel service token
     * @default: empty
     */
    token: "0123456789abcdef", // , default is empty

    /**
     * (Optional) HTTP request timeout
     * Unit: milliseconds (ms)
     * @default: 60_000
     */
    timeout: 10_000,

    /**
     * (Optional) Other Axios request configurations
     * REF: https://axios-http.com/zh/docs/req_config
     * REF: https://www.axios-http.cn/docs/req_config
     */
});

```

### Update client configuration

```javascript
client.updateOptions({
    timeout: 30_000, // Change HTTP request timeout to 30 seconds
});

```

### Call Kernel API (async)

```javascript
import { KernelError, HTTPError } from "siyuan-sdk";

async function func() {
    try {
        /**
         * Asynchronously call the Kernel API `/api/notification/pushMsg`
         * Push notification message
         */
        const response = await client.pushMsg({
            msg: "This is a notification message", // Notification content
            timeout: 7_000, // Notification display time
        });
        console.log(response); // { "code": 0, "msg": "", "data": { "id": "0a1b2c3" } }
    }
    catch (error) {
        if (error instanceof KernelError) { // Kernel error
            console.error(error.body); // Response body { "code": -1, "msg": "error message", "data": null }
        }
        else if (error instanceof HTTPError) { // HTTP request error
            console.error(error.status); // HTTP status code
        }
        else { // Other uncaught errors
            throw error;
        }
    }
    finally {
        /* ... */
    }
}

```

### Call Kernel API (Promise)

```javascript
import { KernelError, HTTPError } from "siyuan-sdk";

function func() {
    /**
     * Asynchronously call the Kernel API `/api/notification/pushErrMsg`
     * Push error message
     */
    client
        .pushErrMsg({
            msg: "This is an error message", // Notification content
            timeout: 7_000, // Notification display time
        })
        .then((response) => {
            console.log(response); // { "code": 0, "msg": "", "data": { "id": "0a1b2c3" } }
        })
        .catch((error) => {
            if (error instanceof KernelError) { // Kernel error
                console.error(error.body); // Response body { "code": -1, "msg": "error message", "data": null }
            }
            else if (error instanceof HTTPError) { // HTTP request error
                console.error(error.status); // HTTP status code
            }
            else { // Other uncaught errors
                throw error;
            }
        })
        .finally(() => {
            /* ... */
        });
}

```

### Use type definitions

```typescript
import { types } from "@siyuan-community/siyuan-sdk";

const payload: types.kernel.api.notification.pushMsg.IPayload = {
    msg: "This is a notification message", // Notification content
    timeout: 7_000, // Notification display time
};

```

```typescript
import pushMsg from "@siyuan-community/siyuan-sdk/dist/src/types/kernel/api/notification/pushMsg";

const payload: pushMsg.IPayload = {
    msg: "This is a notification message", // Notification content
    timeout: 7_000, // Notification display time
};

```

## References

### API References

* [SiYuan API Documentation](https://github.com/siyuan-note/siyuan/blob/master/API_en-US.md)
* [JSON Schema Definitions](https://github.com/siyuan-community/siyuan-sdk/tree/main/schemas)

## Changelog

[CHANGELOG.md](https://github.com/siyuan-community/siyuan-sdk/blob/main/CHANGELOG.md)
