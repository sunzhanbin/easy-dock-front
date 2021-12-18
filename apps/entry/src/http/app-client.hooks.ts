import { runTime } from "@utils/fetch";
// 应用端相关接口
export const appClient = runTime.injectEndpoints({
  endpoints: (build) => ({
    // 获取流程子应用表单的所有控件
    fetchFlowComponents: build.mutation({
      query: (subAppId: number) => `/form/subapp/${subAppId}/all/components`,
    }),
  }),
});

export const { useFetchFlowComponentsMutation } = appClient;
