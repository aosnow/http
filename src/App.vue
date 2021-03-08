<template>
  <div id="app">
    <el-page-header title="返回" content="测试"></el-page-header>

    <h2>http ajax 测试：</h2>
    <el-button @click="handler">点击发送登录请求</el-button>
    <el-button @click="download">点击请求下载文件</el-button>

    <h2>多服务器接口调用测试：</h2>
    <el-button @click="memberHandler">点击发送会员服务接口请求（请求短信）</el-button>
    <el-input v-model="phone"></el-input>
    <el-button @click="sweepHandler">点击发送扫码点餐服务接口请求</el-button>

    <h2>图片下载和请求中断测试：</h2>
    <el-button @click="getImage(1)">点击请求下载图片1</el-button>
    <el-button @click="getImage(2)">点击请求下载图片2</el-button>
    <el-button @click="cancelHandler">取消所有未结束的 Axios 请求</el-button>

    <el-progress :percentage="percent"></el-progress>
    {{percent}}
    <img :src="base64" alt="" style="width:100%;">
  </div>
</template>

<script>
import Vue from 'vue';
import EasyHttp, { HttpError, hash, ResponseType } from '@mudas/http';
import { download } from '@mudas/file';

Vue.use(EasyHttp, [
  { id: 'member', baseURL: `/member-user` },
  { id: 'sweep', baseURL: `/smo-api` },
  { id: 'shop', baseURL: `/shop-api` }
]);

function genRequestInerceptor({ source }) {
  return {
    type: 'request',
    interceptor: config => {
      config.headers.token = sessionStorage.getItem('@mudas/http//token');
      config.headers.invoke_source = source;
      config.headers.out_request_no = hash();
      return config;
    }
  };
}

function genResponseInerceptor() {
  return {
    type: 'response',
    interceptor: response => {
      // 必须返回原数据，否则正常请求之处无法取得该返回数据
      return response;
    },
    error: error => {
      const errInfo = HttpError.info(error);
      throw new Error(errInfo);
    }
  };
}

Vue.http.member.batchUseInterceptor([genRequestInerceptor({
  source: 2103
}), genResponseInerceptor()]);
Vue.http.shop.batchUseInterceptor([genRequestInerceptor({
  source: 2101
}), genResponseInerceptor()]);
// Vue.http.ejectInterceptor('request');

const ReadType = {
  // 按字节读取文件内容，结果用ArrayBuffer对象表示
  ArrayBuffer: 'readAsArrayBuffer',
  // 按字节读取文件内容，结果为文件的二进制串
  BinaryString: 'readAsBinaryString',
  // 读取文件内容，结果用data:url的字符串形式表示
  DataURL: 'readAsDataURL',
  // 按字符读取文件内容，结果用字符串形式表示
  Text: 'readAsText'
};

/**
 * 异步读取图片数据为 base64
 * @param {Blob} rawFile
 * @param {String} [type]
 */
const readfile = (rawFile, type = ReadType.DataURL) => new Promise((resolve, reject) => {
  if (rawFile.toString() !== '[object Blob]') {
    console.warn('the file\'s type is error.');
    reject(rawFile);
  }

  let reader = null;

  const loadHandler = event => {
    const fr = event.target || event.srcElement;

    if (event.type === 'load') {
      resolve(fr.result);

      fr.removeEventListener('load', loadHandler);
      // fr.removeEventListener('progress', loadHandler);
    }
    else if (event.type === 'error') {
      fr.abort();
      reject(event);
    }

    reader = null;
  };

  reader = new FileReader();
  reader[type](rawFile);
  reader.addEventListener('load', loadHandler);
  reader.addEventListener('error', loadHandler);
});

export default {
  name: 'app',
  mixins: [],
  components: {},
  data() {
    return {
      phone: '15258893169',
      percent: 0,
      base64: '',
      url1: 'https://img.zcool.cn/community/0107a55d426347a8012187f40ef8be.jpg',
      url2: 'https://img.zcool.cn/community/01d31a60458f4611013f3745567b66.jpg@1280w_1l_2o_100sh.jpg'
    };
  },
  methods: {
    download() {
      Vue.http.shop.post(
        '/goods/goods/exportGoods',
        {},
        {
          responseType: ResponseType.blob // 响应头格式
        }
      ).then(({ data }) => {
        download(data, '测试文件');
      }).catch(reason => {
        console.warn('catch:', reason);
      });
    },

    handler() {
      Vue.http.shop.post(
        '/v2/user-system/login/login', {
          username: 'ghl_test',
          password: '123456'
        }
      ).then(({ data }) => {
        console.warn(data);
        if (data.code === '10000') {
          console.warn(data);
          const { token } = data.data;
          sessionStorage.setItem('@mudas/http//token', token);
        }
        else {
          console.warn(new Error(data['sub_msg'] || data.msg));
        }
      }).catch(reason => {
        console.warn('catch:', reason);
      });
    },

    progress(progressEvent) {
      const { total, loaded } = progressEvent;
      this.percent = loaded / total * 100 >> 0;
      console.warn(progressEvent, progressEvent.target.response);
    },

    getImage(id) {
      this.percent = 0;

      Vue.http.get(
        this['url' + id],
        null,
        {
          responseType: ResponseType.blob, // 响应头格式
          onDownloadProgress: this.progress
        }
      ).then(({ data }) => {
        console.warn(data);
        data && readfile(data).then(imageData => {
          this.base64 = imageData;
        });
      }).catch(reason => {
        console.warn('catch:', reason);
      });
    },

    memberHandler() {
      console.warn('会员接口请求：', Vue.http.member);
      Vue.http.member
         .post('/comm/sendMsgCode', { phone: this.phone }) // 支付宝
         .then(({ data }) => {
           console.warn('会员短信信息：', data);
         }).catch(reason => Promise.reject(reason));
    },

    sweepHandler() {
      console.warn('扫码点餐接口请求：', Vue.http.sweep);
      Vue.http.sweep
         .get('/index/getUserInfo', { authMode: 1, buyerId: '2088002288842095' }) // 支付宝
         .then(({ data }) => {
           console.warn('会员信息：', data);
         }).catch(reason => Promise.reject(reason));
    },

    cancelHandler() {
      // TODO: 请求取消 Vue.http.cancel();
      Vue.http.cancel();
    }
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 50px;
}
</style>
