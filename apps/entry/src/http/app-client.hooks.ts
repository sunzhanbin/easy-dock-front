import { runTime } from '@utils/fetch';
import { ProcessDataManagerParams } from '@/consts';

// 应用端相关接口
export const appClient = runTime.injectEndpoints({
  endpoints: (build) => ({
    // 获取流程子应用表单的所有控件
    fetchFlowComponents: build.mutation({
      query: (subAppId: number) => `/form/subapp/${subAppId}/all/components`,
    }),
    // 获取流程数据管理的数据
    fetchProcessDataManager: build.mutation({
      query: (params: ProcessDataManagerParams) => ({
        url: '/task/processDataManager/list',
        method: 'post',
        body: params,
      }),
    }),
    // 批量获取用户、角色、部门
    fetchUsers: build.mutation({
      query: (params: { deptIds?: number[]; roleIds?: number[]; userIds?: number[] }) => ({
        url: '/user/query/owner',
        method: 'post',
        body: params,
      }),
    }),
    // 搜索项目用户
    searchUser: build.mutation({
      query: (params: { projectId: number; keyword?: string; index: number; size: number }) => ({
        url: '/user/search',
        method: 'post',
        body: params,
      }),
    }),
    fetchSubApp: build.mutation({
      query: (subAppId: number) => `/subapp/${subAppId}`,
    }),
  }),
});

export const {
  useFetchUsersMutation,
  useSearchUserMutation,
  useFetchSubAppMutation,
  useFetchFlowComponentsMutation,
  useFetchProcessDataManagerMutation,
} = appClient;
