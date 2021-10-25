import { message } from 'antd';
import Axios, { AxiosRequestConfig } from 'axios';

function createAxios(config?: AxiosRequestConfig) {
  const instance = Axios.create({
    ...config,
    headers: {
      auth: window.localStorage.getItem('auth'),
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
        if (window.Auth) {
          // window.Auth.logout();
          window.localStorage.removeItem('auth');
          const token = await window.Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);
          console.info(token);
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
