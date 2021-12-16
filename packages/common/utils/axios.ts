import { message } from 'antd';
import Axios, { AxiosRequestConfig, AxiosInstance } from 'axios';

import Auth from '@enc/sso';

new Auth();

function createAxios(config?: AxiosRequestConfig): AxiosInstance {
  const instance = Axios.create({
    ...config,
    headers: {
      auth: window.Auth && window.Auth.getAuth(),
      ...(config ? config.headers : {}),
    },
  });

  instance.interceptors.response.use(
    function (response) {
      return response.data;
    },
    async function ({ config, message: errMsg, response }) {
      const { status, data } = response || {};

      if (status === 500) {
        errMsg = '服务异常';
      } else if (status === 403) {
        // import Auth 之后 Auth 的实例会放入 window.Auth 中
        if (window.Auth && window.Auth.getAuth()) {
          window.Auth.logout();
        } 

        return Promise.reject({
          code: -1,
          resultMessage: '未登录',
        });
      } else if (data && data.resultMessage) {
        // 后端统一错误信息字段
        errMsg = data.resultMessage;
      }

      if (!config.silence) {
        message.error(errMsg);
      }

      return Promise.reject({
        code: -1,
        data: null,
        resultMessage: errMsg,
      });
    },
  );

  return instance;
}

export default createAxios;
