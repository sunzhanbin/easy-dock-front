import { message } from 'antd';
import Axios, { AxiosRequestConfig } from 'axios';
import { localStorage } from './storage';
import cookie from 'js-cookie';

function createAxios(config?: AxiosRequestConfig) {
  const instance = Axios.create({
    ...config,
    headers: {
      auth: cookie.get('token'),
      ...(config ? config.headers : {}),
    },
  });

  instance.interceptors.response.use(
    function (response) {
      return response.data;
    },
    function ({ config, message: errMsg, response }) {
      const { status, data } = response || {};

      if (status === 500) {
        errMsg = '服务异常';
      } else if (status === 403) {
        window.location.replace(window.COMMON_LOGIN_URL + `?redirect=${encodeURIComponent(window.location.href)}`);

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
