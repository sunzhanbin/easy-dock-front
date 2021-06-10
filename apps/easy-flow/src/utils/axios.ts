import { message } from 'antd';
import Axios from 'axios';
import { localStorage } from './localstorage';

// 应该区分开发环境和生产环境，暂时写死
const EASY_DOCK_BASE_SERVICE_ENDPOINT = 'http://10.19.151.142:28300';
const instance = Axios.create({
  baseURL: `${EASY_DOCK_BASE_SERVICE_ENDPOINT}/enc-oss-easydock/api/builder/v1`,
  headers: {
    auth: localStorage.get('token'),
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
      //  history.replace(ROUTES.LOGIN);
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

export default instance;
