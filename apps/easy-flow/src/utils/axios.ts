import axios from '@common/utils/axios';

axios.defaults.baseURL = `${process.env.EASY_DOCK_BASE_SERVICE_ENDPOINT}/enc-oss-easydock/api`;

export default axios;
