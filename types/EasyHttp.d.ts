// ------------------------------------------------------------------------------
// name: EasyHttp.d
// author: 喵大斯( mschool.tech )
// created: 2019/8/4
// ------------------------------------------------------------------------------

import { AxiosRequestConfig, AxiosResponse } from "./axios";

type InterceptorType = 'request' | 'response';
type RequestInterceptor = (config:AxiosRequestConfig) => AxiosRequestConfig;
type ResponseInterceptor = (response:AxiosResponse) => AxiosResponse;

interface InterceptorConfig
{
  type:InterceptorType;
  interceptor:RequestInterceptor | ResponseInterceptor;
  error?:Function;
}

export interface EasyHttpInstance
{
  /**
   * 取消所有请求（message 参数是可选的）
   * @param {String} [message] 做为请求失败时的返回信息
   */
  cancel(message?:string);

  /**
   * 通过 get 方式请求数据
   * @param {string} url 请求地址
   * @param {Object} data 需要提交的参数数据（做为 url params 提交）
   * @param {Object} [conf] 附加配置参数（可覆盖默认配置，如覆盖 responseType）
   * @returns {Promise}
   */
  get(url, data?:any, conf?:any):Promise<any>;

  /**
   * 通过 delete 方式请求数据
   * @param {string} url 请求地址
   * @param {Object} data 需要提交的参数数据
   * @param {Object} [conf] 附加配置参数（可覆盖默认配置，如覆盖 responseType）
   * @returns {Promise}
   */
  delete(url, data?:any, conf?:any):Promise<any>;

  /**
   * 通过 get 方式提交参数并请求数据
   * @param {string} url 请求地址
   * @param {Object} data 需要提交的参数数据（做为 url params 提交）
   * @param {Object} [conf] 附加配置参数（可覆盖默认配置，如覆盖 responseType）
   * @returns {Promise}
   */
  post(url, data?:any, conf?:any):Promise<any>;

  /**
   * 通过 put 方式提交参数并请求数据
   * @param {string} url 请求地址
   * @param {Object} data 需要提交的参数数据
   * @param {Object} [conf] 附加配置参数（可覆盖默认配置，如覆盖 responseType）
   * @returns {Promise}
   */
  put(url, data?:any, conf?:any):Promise<any>;

  /**
   * 发送 axios 请求
   * @param {AxiosRequestConfig} conf 单个请求配置如“{ method:'', url:'', params:{}, data:{} }”
   * @returns {Promise}
   */
  request(conf:AxiosRequestConfig):Promise<any>;

  /**
   * 批量注册拦截器
   * @param {InterceptorConfig[]} interceptors
   */
  batchUseInterceptor(interceptors:Array<InterceptorConfig>):void;

  /**
   * 注册拦截器
   * @param {String} type 注册类型（request / response）
   * @param {Function} fulfilled 处理函数（具体使用方法请参考 Axios 官方文档）
   * @param {Function} [rejected] 错误捕获处理函数
   * @return {Number} id 返回供注销时使用的唯一 id
   */
  useInterceptor(type:InterceptorType, fulfilled:Function, rejected?:Function):number;

  /**
   * 移除所有指定类型的拦截器
   * @param {String} type 注册类型（request / response）
   * @param {Number} [id] 移除指定的拦截器，未指定则移除全部拦截器
   */
  ejectInterceptor(type:InterceptorType, id?:number);
}

export interface EasyHttpStatic
{
  /**
   * 默认配置
   * @type {AxiosRequestConfig}
   */
  Default:AxiosRequestConfig;

  /**
   * 构建 API 通信模块实例
   * @param {AxiosRequestConfig} [conf] 配置信息
   */
  new(conf?:AxiosRequestConfig):EasyHttpInstance;
}

declare const EasyHttp:EasyHttpStatic;

export default EasyHttp;
