// ------------------------------------------------------------------------------
// name: index
// author: 喵大斯( mschool.tech )
// created: 2019/6/26 21:04
// ------------------------------------------------------------------------------

import EasyHttp from './EasyHttp';
import HttpError from './HttpError';
import { ResponseType, ContentType } from './Types';
import { hash } from './utils';

/**
 * 注册插件
 * @param Vue
 * @param {EasyHttpOptions} [options]
 */
function install(Vue, options) {
  if (Array.isArray(options)) {
    const https = Object.create(null);
    let defaultHttp = null;

    options.forEach(option => {
      if (!option.id || typeof option.id !== 'string') throw new Error('Illegal parameters for EasyHttpInstaller');

      https[option.id] = new EasyHttp(option);
      if (!defaultHttp) defaultHttp = https[option.id];
    });

    // 默认 Vue.http 为配置项目第一个创建的 EasyHttp（保留老版本的兼容调用）
    Vue.http = Object.create(defaultHttp);

    // 将所有 EasyHttp 添加到 Vue.http 的子级
    Object.keys(https).forEach(id => {
      Vue.http[id] = https[id];
    });
  }
  else {
    // 不绑定到 Vue.prototype 的目的在于，禁止在视图层做任何 http 请求
    Vue.http = new EasyHttp(options);
  }
}

export default install;
export { install, EasyHttp, HttpError, ResponseType, ContentType, hash };
