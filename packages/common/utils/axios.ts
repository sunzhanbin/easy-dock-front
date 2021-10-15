import { message } from 'antd';
import Axios, { AxiosRequestConfig } from 'axios';
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
    async function ({ config, message: errMsg, response }) {
      const { status, data } = response || {};

      if (status === 500) {
        errMsg = '服务异常';
      } else if (status === 403) {
        // window.location.replace(window.COMMON_LOGIN_URL + `?redirect=${encodeURIComponent(window.location.href)}`);
        if (window.Auth?.getToken) {
          const token = await window.Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);
          if (token) {
            cookie.set('token', token, { expires: 1 });
            Promise.resolve().then(() => {
              window.location.reload();
            });
          }
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
