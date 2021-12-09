import baseFetch from "@utils/fetch";

export const appManager = baseFetch.injectEndpoints({
  endpoints: (build) => ({
    // 添加工作区；
    addWorkspace: build.mutation({
      query: (params?: { name: string; projectId: number }) =>
        ({
          url: "/app",
          method: "post",
          data: params,
        } as any),
      invalidatesTags: [{ type: "Workspace", id: "LIST" }],
    }),
    // 工作区里列表；
    fetchWorkspaceList: build.query({
      query: (projectId: number) => `/app/${projectId}/list/all`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: number }) => ({
                type: "Workspace" as const,
                id,
              })),
              { type: "Workspace", id: "LIST" },
            ]
          : [{ type: "Workspace", id: "LIST" }],
    }),
    // 工作区详情；
    workspaceDetail: build.query({
      query: (workspaceId: number) => `/app/${workspaceId}`,
    }),
    // 添加子应用；
    addSubApp: build.mutation({
      query: (params: { appId: number; name: string; type: number }) =>
        ({
          url: "/subapp",
          method: "post",
          data: params,
        } as any),
      invalidatesTags: [{ type: "SubApps", id: "LIST" }],
    }),
    // 子应用列表；
    fetchsubAppList: build.query({
      query: (workspaceId: number) => `/subapp/${workspaceId}/list/all`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: number }) => ({
                type: "SubApps" as const,
                id,
              })),
              { type: "SubApps", id: "LIST" },
            ]
          : [{ type: "SubApps", id: "LIST" }],
    }),
    // 修改应用状态 & 发布应用配置；
    modifyAppStatus: build.mutation({
      query: (params: { status: number; id: number }) =>
        ({
          url: `/app/status`,
          method: "put",
          data: params,
        } as any),
    }),
    // 保存应用配置；
    saveAppSetup: build.mutation({
      query: (params: {
        id: number;
        name: string;
        icon: string;
        meta: { [key: string]: any };
        navMode: number;
        remark: string;
        theme: string;
      }) =>
        ({
          url: "/app/extension",
          method: "put",
          data: params,
        } as any),
    }),
  }),
  // overrideExisting: false,
});

export const {
  useAddWorkspaceMutation,
  useFetchWorkspaceListQuery,
  useWorkspaceDetailQuery,
  useAddSubAppMutation,
  useFetchsubAppListQuery,
  useModifyAppStatusMutation,
  useSaveAppSetupMutation,
} = appManager;