// ------------------------------------------------------------------------------
// name: EasyHttp
// author: 喵大斯( mschool.tech )
// created: 2019/8/1 0:54
// ------------------------------------------------------------------------------

import axios from 'axios';
import { merge, set, isNumber, hash } from '@mudas/util';
import { ResponseType, ContentType } from './Types';

/**
 * http get post 请求
 * request、response 请求、返回的拦截处理
 * 与 service 层的设计思想融合
 */
class EasyHttp {

  /**
   * 默认配置
   * @type {AxiosRequestConfig}
   */
  static Default = {
    responseType: ResponseType.json, // 默认响应数据类型
    headers: { 'Content-Type': ContentType.json } // 默认请求数据类型
  };

  // --------------------------------------------------------------------------
  //
  // Class constructor
  //
  // --------------------------------------------------------------------------

  /**
   * 构建 API 通信模块实例
   * @param {AxiosRequestConfig} [conf] 配置信息
   */
  constructor(conf) {
    // 缓存配置数据
    this._conf = merge(Object.create(null), EasyHttp.Default, conf);

    // 初始化
    this._init();
  }

  _init() {
    // 创建实例成员（不影响全局使用）
    this._axios = axios.create(this._conf || Object.create(null));

    // cancel token
    this._initCancelToken();
  }

  // --------------------------------------------------------------------------
  //
  // Class properties
  //
  // --------------------------------------------------------------------------

  /**
   * 配置信息
   * @type {AxiosRequestConfig}
   * @private
   */
  _conf = null;

  /**
   * 创建实例，不影响全局使用
   * @type {AxiosInstance}
   * @private
   */
  _axios = null;

  /**
   * Axios Cancel Token
   * @type {CancelTokenSource}
   * @private
   */
  _source = null;

  // --------------------------------------------------------------------------
  //
  // Class methods
  //
  // --------------------------------------------------------------------------

  /**
   * 创建 axios cancel token
   */
  _initCancelToken() {
    this._source = null;
    this._source = axios.CancelToken.source();
  }

  /**
   * 取消所有请求（message 参数是可选的）
   * @param {String} [message] 做为请求失败时的返回信息
   */
  cancel(message) {
    this._source.cancel(message);

    // 重新生成新的 token，否则后续请求将被继续直接取消
    this._initCancelToken();
  }

  /**
   * 校验 get 参数设置
   * @param conf
   * @private
   */
  _correctGet(conf) {
    // get 方式的请求，数据存入 params
  }

  /**
   * 校验 post 参数设置
   * @param conf
   * @private
   */
  _correctPost(conf) {
    // post 方式的请求，数据存入 data
    // 必须是以下类型之一：
    // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
    // - 浏览器专属：FormData, File, Blob
    // - Node 专属： Stream
  }

  /**
   * 校验缓存设置
   * @param conf
   * @private
   */
  _correctCache(conf) {
    // 通过URL附加参数禁用浏览器缓存特性
    if (this._conf['noCache']) {
      set(conf, 'params.timestamp', hash());
    }
  }

  /**
   * 通过 get 方式请求数据
   * @param {string} url 请求地址
   * @param {any} data 需要提交的参数数据（做为 url params 提交）
   * @param {AxiosRequestConfig} [conf] 附加配置参数（可覆盖默认配置，如覆盖 responseType）
   * @returns {Promise}
   */
  get(url, data = null, conf = null) {
    return this.request({ method: 'get', url, params: data, ...conf });
  }

  /**
   * 通过 delete 方式请求数据
   * @param {string} url 请求地址
   * @param {any} data 需要提交的参数数据
   * @param {AxiosRequestConfig} [conf] 附加配置参数（可覆盖默认配置，如覆盖 responseType）
   * @returns {Promise}
   */
  delete(url, data = null, conf = null) {
    return this.request({ method: 'delete', url, params: data, ...conf });
  }

  /**
   * 通过 get 方式提交参数并请求数据
   * @param {string} url 请求地址
   * @param {any} data 需要提交的参数数据（做为 url params 提交）
   * @param {AxiosRequestConfig} [conf] 附加配置参数（可覆盖默认配置，如覆盖 responseType）
   * @returns {Promise}
   */
  post(url, data = null, conf = null) {
    return this.request({ method: 'post', url, data, ...conf });
  }

  /**
   * 通过 put 方式提交参数并请求数据
   * @param {string} url 请求地址
   * @param {any} data 需要提交的参数数据
   * @param {AxiosRequestConfig} [conf] 附加配置参数（可覆盖默认配置，如覆盖 responseType）
   * @returns {Promise}
   */
  put(url, data = null, conf = null) {
    return this.request({ method: 'put', url, data, ...conf });
  }

  /**
   * 发送 axios 请求
   * @param {AxiosRequestConfig} conf 单个请求配置如“{ method:'', url:'', params:{}, data:{} }”
   * @returns {Promise}
   */
  request(conf) {
    if (!conf.method) {
      throw new Error('conf.method must be setup, but it\'s not define now.');
    }

    if (!conf.url) {
      throw new Error('conf.url must be setup, but it\'s not define now.');
    }

    this._correctGet(conf);
    this._correctPost(conf);
    this._correctCache(conf);

    // 设置取消请求的切入点
    conf.cancelToken = this._source.token;

    return this._axios.request(conf);
  }

  // --------------------------------------------------------------------------
  //
  // Interceptor methods
  //
  // --------------------------------------------------------------------------

  /**
   * 批量注册拦截器
   * @param {InterceptorConfig[]} interceptors
   */
  batchUseInterceptor(interceptors) {
    interceptors.forEach(item => {
      const { type, interceptor, error } = item;
      this.useInterceptor(type, interceptor, error);
    });
  }

  /**
   * 注册拦截器
   * @param {String} type 注册类型（request / response）
   * @param {Function} fulfilled 处理函数（具体使用方法请参考 Axios 官方文档）
   * @param {Function} [rejected] 错误捕获处理函数
   * @return {Number} id 返回供注销时使用的唯一 id
   */
  useInterceptor(type, fulfilled, rejected = null) {
    const target = this._axios.interceptors[type];
    return target.use(fulfilled, rejected);
  }

  /**
   * 移除所有指定类型的拦截器
   * @param {String} type 注册类型（request / response）
   * @param {Number} [id] 移除指定的拦截器，未指定则移除全部拦截器
   */
  ejectInterceptor(type, id) {
    const target = this._axios.interceptors[type];
    const handlers = target['handlers'];

    // 通过 eject 方法注销拦截器，因其设计时用数组下标做为标记，不能打乱其排列顺序
    if (isNumber(id) && id < handlers.length) {
      target.eject(id);
    }
    else {
      handlers.forEach((interceptor, index) => {
        target.eject(index);
      });
    }
  }
}

export default EasyHttp;
