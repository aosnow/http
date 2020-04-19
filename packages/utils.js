// ------------------------------------------------------------------------------
// name: utils
// author: 喵大斯( mschool.tech )
// created: 2019/8/1 14:41
// ------------------------------------------------------------------------------

import { sha1 } from 'hash.js';

/**
 * 生成 sha1 乱码串
 * @param [input]
 * @param [random] 默认生成随机串（每次结果不同）
 * @return {Buffer | string | PromiseLike<ArrayBuffer>}
 */
function hash(input = '', random = true) {
  input = input || '';
  input = `${input}${random ? Math.random() : ''}`;
  return sha1().update(input).digest('hex');
}

export { hash };
