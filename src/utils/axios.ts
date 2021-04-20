import { message } from 'antd';
import Axios from 'axios';
import { localStorage } from './localstorage';

const instance = Axios.create({
  baseURL: `${process.env.REACT_APP_MAIN_DOMAIN}`,
  headers: {
    auth: localStorage('token'),
  },
});

instance.interceptors.response.use(
  function (response) {
    const { data, config } = response;
    if (data.resultCode === 0) {
      return data;
    } else {
      if (!config.silence) {
        message.error(data.resultMessage);
      }

      return Promise.reject(data);
    }
  },
  function ({ config, message: errMsg, response }) {
    if (!config.silence) {
      if (response && response.status === 500) {
        errMsg = '服务异常';
      }

      message.error(errMsg);
    }

    return Promise.reject({
      code: -1,
      data: null,
      resultMessage: (response && response.data && response.data.resultMessage) || errMsg,
    });
  },
);

export default instance;
