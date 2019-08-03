# @mudas/http

> this is a http lib.

## Usage
安装模块：
```npm
npm i @mudas/http -S
```

注册方法：
```js
import Vue from 'vue';
import { EasyHttpPlugin } from '@mudas/http';

// EasyHttpPlugin 意在创建 EasyHttp 实例，绑定到 Vue.http
Vue.use(EasyHttpPlugin);

// 也可同时设置全局 Axios 配置
// Vue.use(EasyHttpPlugin, {timeout: 5000});
```

## Readme
EasyHttp 默认发送和响应的类型皆为 'json'：
```js
/**
 * 默认配置
 * @type {AxiosRequestConfig}
 */
static Default = {
  responseType: ResponseType.json, // 默认响应数据类型
  headers: { 'Content-Type': ContentType.json } // 默认请求数据类型
};
```

### 其它功能使用介绍：
1、发送请求
```js
import { ResponseType, ContentType } from '@mudas/http';
Vue.http.get(url, data);
Vue.http.post(url, data);
Vue.http.delete(url, data);
Vue.http.put(url, data);

// 上传文件
Vue.http.post(
  '/api/upload',
  formData,
  {headers: {'content-type': ContentType.formData}}
).then(({ data }) => {
  // data is Blob
  download(data, 'filename');
});

// 接收文件数据
Vue.http.post(
  '/api/export',{},{responseType: ResponseType.blob}
).then(({ data }) => {
  // data is Blob
  download(data, 'filename');
});
```

2、取消所有未完成的 request:
```js
Vue.http.cancel();
```

3、注册拦截器
```js
// request 拦截器
Vue.http.useInterceptor('request', config => {
  config.headers.invoke_source = '2101';
  config.headers.request_no = hash();
  return config;
});

// response 拦截器
Vue.http.useInterceptor(
  'response',
  response => {
    // ... 对 response 做前置处理
    return response;
  },
  error => {
    const errInfo = HttpError.info(error);
    throw new Error(errInfo);
  }
);
```

4、移除拦截器
```js
// 移除全部指定类型的拦截器
Vue.http.ejectInterceptor('request');

// 移除指定拦截器
const id = Vue.http.useInterceptor('request', config => {
  // ...
  return config;
});
Vue.http.ejectInterceptor('request', id);
```

5、使用内置优化的 Http Error Info
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
### v0.0.3
优化构建规则

### v0.0.2
优化构建规则，以及包的依赖关系，做个更合格的 lib

### v0.0.1
初始化版本，包含 get/post/delete/put，请求拦截，Http Error Info 等
