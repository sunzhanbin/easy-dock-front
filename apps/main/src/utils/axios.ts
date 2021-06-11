import createAxios from '@common/utils/axios';

const axios = createAxios({ baseURL: `${window.EASY_DOCK_BASE_SERVICE_ENDPOINT}/enc-oss-easydock/api/builder/v1` });

export const buildAxios = axios;

export default axios;
