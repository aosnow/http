# @mudas/http

> This is a secondary encapsulation library that extends Axios.

## Setup
install：
```npm
npm i @mudas/http lodash-es core-js axios -S
```

register vue plugin：
```js
import Vue from 'vue';
import EasyHttp from '@mudas/http';

// bind Vue.http
Vue.use(EasyHttp);

// Specify configuration for Axios
// Vue.use(EasyHttp, {timeout: 5000});
```

## Usage
The content of both requests and responses is 'json'：
```js
/**
 * Default config
 * @type {AxiosRequestConfig}
 */
static Default = {
  responseType: ResponseType.json, // reponse type
  headers: { 'Content-Type': ContentType.json } // request type
};
```

### Other features：
1、post request
```js
import { ResponseType, ContentType } from '@mudas/http';
Vue.http.get(url, data);
Vue.http.post(url, data);
Vue.http.delete(url, data);
Vue.http.put(url, data);

// upload file
Vue.http.post(
  '/api/upload',
  formData,
  {headers: {'content-type': ContentType.formData}}
).then(({ data }) => {
  // data is Blob
  download(data, 'filename');
});

// get file data
Vue.http.post(
  '/api/export',{},{responseType: ResponseType.blob}
).then(({ data }) => {
  // data is Blob
  download(data, 'filename');
});
```

2、Cancel all outstanding requests:
```js
Vue.http.cancel();
```

3、Registered Interceptor
```js
// request interceptor
Vue.http.useInterceptor('request', config => {
  config.headers.invoke_source = '2101';
  config.headers.request_no = hash();
  return config;
});

// response interceptor
Vue.http.useInterceptor(
  'response',
  response => {
    // TODO: ...
    return response;
  },
  error => {
    const errInfo = HttpError.info(error);
    throw new Error(errInfo);
  }
);

// batch registration
// const interceptors = [];
Vue.http.batchUseInterceptor(interceptors);
```

4、Remove interceptor
```js
// Remove all specified types of interceptors
Vue.http.ejectInterceptor('request');

// Remove specified id of interceptors
const id = Vue.http.useInterceptor('request', config => {
  // TODO:...
  return config;
});
Vue.http.ejectInterceptor('request', id);
```

5、Using built-in optimized HttpErrorInfo
```js
import { HttpError  } from '@mudas/http';
Vue.http.useInterceptor(
  'response',
  null,
  error => {
    const errInfo = HttpError.info(error);
    throw new Error(errInfo);
  }
);
```

## ChangeLog
### v0.0.11-beta.07
- 完善 README.md

### v0.0.11-beta.06
- 细节调整，类型声明

### v0.0.11-beta.05
- 完善 `index.d.ts` 类型定义

### v0.0.11-beta.04
- 完善 export

### v0.0.11-beta.03
- 完善 export 和 import 使用方式，类型定义完善

### v0.0.11-beta.02
- 完善 HttpError 解析逻辑，无匹配的 Error 解析保留原有 Error.message 输出

### v0.0.10 ~ v0.0.11-beta.01
- 完善 `index.d.ts` 类型定义

### v0.0.9
- `EasyHttp` 增加 `batchUseInterceptor()` 实例方法，批量注册拦截器
- 完善 `index.d.ts` 类型定义

### v0.0.5 ~ v0.0.8
- 完善 `lib` 所涉及 `index.d.ts` 类型定义

### v0.0.4
- 优化构建规则，修正 `npm` 安装需要包名列表（`npm3+`不支持自动安装`peerDependencies`）
- 除去 `changelog` 的其它部分，全部使用英文描述

### v0.0.3
- 优化构建规则

### v0.0.2
- 优化构建规则，以及包的依赖关系，做个更合格的 lib

### v0.0.1
- 初始化版本，包含 `get/post/delete/put`，请求拦截，`Http Error Info` 等
