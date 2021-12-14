import axiosInstance from "@common/utils/axios";
import { createApi } from "@reduxjs/toolkit/query/react";

// export default createAxios({ baseURL: `${process.env.REACT_APP_EASY_DOCK_BASE_SERVICE_ENDPOINT}/enc-oss-easydock/api/builder/v1` });

export default createApi({
  reducerPath: "appsOrchestrationApi",
  baseQuery: axiosInstance({
    baseURL: `${process.env.REACT_APP_EASY_DOCK_BASE_SERVICE_ENDPOINT}/enc-oss-easydock/api/builder/v1`,
  }),
  tagTypes: ["Workspace", "SubApps", "Project"],
  endpoints: () => ({}),
});

export const axios = axiosInstance({
  baseURL: `${process.env.REACT_APP_EASY_DOCK_BASE_SERVICE_ENDPOINT}/enc-oss-easydock/api/runtime/v1`,
});
