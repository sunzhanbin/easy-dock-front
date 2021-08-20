import createAxios from '../../utils/axios';

export const axios = createAxios({
  baseURL: `${window.EASY_DOCK_BASE_SERVICE_ENDPOINT}/enc-oss-easydock/api/runtime/v1`,
});
