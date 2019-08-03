// ------------------------------------------------------------------------------
// name: index
// author: 喵大斯( mschool.tech )
// created: 2019/6/26 21:04
// ------------------------------------------------------------------------------

import EasyHttp from './EasyHttp';
import HttpError from './HttpError';
import { ResponseType, ContentType } from './Types';
import { hash } from './utils';

// 做为 Vue Plugin
function EasyHttpPlugin(Vue, config) {
  // 不绑定到 Vue.prototype 的目的在于，禁止在视图层做任何 http 请求
  Vue.http = new EasyHttp(config);
}

export {
  // vue plugin
  EasyHttpPlugin,

  // 原生导出
  HttpError,
  EasyHttp,
  ResponseType,
  ContentType,

  // 工具方法
  hash
};
