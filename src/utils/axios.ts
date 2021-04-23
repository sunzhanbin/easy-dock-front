import { message } from 'antd';
import Axios from 'axios';
import { localStorage } from './localstorage';

const instance = Axios.create({
  baseURL: `${process.env.REACT_APP_MAIN_DOMAIN}/enc-oss-easydock/api/builder/v1`,
  headers: {
    auth: localStorage('token'),
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
