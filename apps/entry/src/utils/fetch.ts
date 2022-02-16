import axiosInstance from "@common/utils/axios";
import { createApi } from "@reduxjs/toolkit/query/react";
import { builderQueryWithIntercept, runtimeQueryWithIntercept } from "@utils/intercept";

export default createApi({
  reducerPath: "appsOrchestrationApi",
  baseQuery: builderQueryWithIntercept,
  tagTypes: ["Workspace", "SubApps", "Project"],
  endpoints: () => ({}),
});

export const axios = axiosInstance({
  baseURL: `${
    window.EASY_DOCK_BASE_SERVICE_ENDPOINT || process.env.REACT_APP_EASY_DOCK_BASE_SERVICE_ENDPOINT
  }/enc-oss-easydock/api/runtime/v1`,
});

export const runTime = createApi({
  reducerPath: "appsOrchestrationRuntimeApi",
  baseQuery: runtimeQueryWithIntercept,
  tagTypes: ["Workspace", "SubApps", "Project"],
  endpoints: () => ({}),
});
