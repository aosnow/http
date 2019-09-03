// ------------------------------------------------------------------------------
// name: index.d
// author: 喵大斯( mschool.tech )
// created: 2019/8/1
// ------------------------------------------------------------------------------

import _Vue from 'vue';
import { AxiosRequestConfig } from './axios';
import EasyHttp, { EasyHttpInstance } from './EasyHttp';
import HttpError from './HttpError';

/**
 * 生成 sha1 乱码串
 * @param [input]
 * @param [random] 默认生成随机串（每次结果不同）
 * @return {string}
 */
declare function hash(input?:string, random?:boolean):string

declare const ResponseType:{
  text:'text';
  json:'json'; // IE10/11 不支持该类型
  blob:'blob';
  document:'document';
  arraybuffer:'arraybuffer';
};

declare const ContentType:{
  stream:'application/octet-stream';
  json:'application/json';
  form:'application/x-www-form-urlencoded';
  formData:'multipart/form-data';
  javascript:'application/x-javascript';
};

// 扩展 Vue 静态属性，若是实例属性直接扩展 interface Vue 即可
declare module 'vue/types/vue' {
  interface VueConstructor {
    http:EasyHttpInstance;
  }
}

export declare function install(Vue:typeof _Vue, options?:AxiosRequestConfig):void;

declare const _default:{
  install:typeof install,
  HttpError:HttpError,
  EasyHttp:typeof EasyHttp,
  ContentType:typeof ContentType,
  ResponseType:typeof ResponseType,
  hash:typeof hash
};
export default _default;
export { HttpError, EasyHttp, ContentType, ResponseType, hash };
