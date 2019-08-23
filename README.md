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
