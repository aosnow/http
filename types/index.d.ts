// ------------------------------------------------------------------------------
// name: index.d
// author: 喵大斯( mschool.tech )
// created: 2019/8/1
// ------------------------------------------------------------------------------

import Vue from 'vue';
import { AxiosRequestConfig } from "./axios";
import EasyHttp from './EasyHttp';
import HttpError from './HttpError';

/**
 * 做为 Vue 插件提供注册，绑定 EasyHttp 实例到 Vue.http
 * @param {Vue} Vue
 * @param {AxiosRequestConfig} config
 * @constructor
 */
declare function EasyHttpPlugin( Vue, config );

/**
 * 生成 sha1 乱码串
 * @param [input]
 * @param [random] 默认生成随机串（每次结果不同）
 * @return {Buffer | string | PromiseLike<ArrayBuffer>}
 */
declare function hash( input?:string, random?:boolean )

declare const ResponseType:{
  text:'text',
  json:'json', // IE10/11 不支持该类型
  blob:'blob',
  document:'document',
  arraybuffer:'arraybuffer'
};

declare const ContentType:{
  stream:'application/octet-stream',
  json:'application/json',
  form:'application/x-www-form-urlencoded',
  formData:'multipart/form-data',
  javascript:'application/x-javascript'
};

// 扩展 Vue 静态属性，若是实例属性直接扩展 interface Vue 即可
export interface VueConstructor<V extends Vue = Vue>
{
  http:EasyHttp;
}

export default EasyHttp;

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

