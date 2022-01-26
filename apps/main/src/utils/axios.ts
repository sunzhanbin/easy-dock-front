import createAxios from "@common/utils/axios";

const axios = createAxios({ baseURL: `${window.EASY_DOCK_BASE_SERVICE_ENDPOINT}/enc-oss-easydock/api/builder/v1` });

export const builderAxios = axios;
export const runtimeAxios = createAxios({
  baseURL: `${window.EASY_DOCK_BASE_SERVICE_ENDPOINT}/enc-oss-easydock/api/runtime/v1`,
});

export default axios;
