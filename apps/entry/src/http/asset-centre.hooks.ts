import baseFetch from "@utils/fetch";

export const assetCentreBuilder = baseFetch.injectEndpoints({
  endpoints: (build) => ({
    // 新建插件
    addPlugins: build.mutation({
      query: (params: any) => ({
        url: "/plugin",
        method: "post",
        body: params,
      }),
      invalidatesTags: [{ type: "Plugins", id: "LIST" }],
    }),
    // 获取插件列表
    getPluginsList: build.query({
      query: (params: any) => ({
        url: "/plugin/list/condition/get",
        method: "post",
        body: params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: number }) => ({
                type: "Plugins" as const,
                id,
              })),
              { type: "Plugins", id: "LIST" },
            ]
          : [{ type: "Plugins", id: "LIST" }],
    }),
    // 编辑插件
    editPlugins: build.mutation({
      query: (params: any) => ({
        url: "/plugin",
        method: "put",
        body: params,
      }),
      invalidatesTags: [{ type: "Plugins", id: "LIST" }],
    }),
    // 新建分组
    addGroups: build.mutation({
      query: (params: any) => ({
        url: "/plugin/group",
        method: "post",
        body: params,
      }),
      invalidatesTags: [{ type: "Plugins", id: "Groups" }],
    }),
    // 编辑分组
    editGroups: build.mutation({
      query: (params: any) => ({
        url: "/plugin/group",
        method: "put",
        body: params,
      }),
      invalidatesTags: [{ type: "Plugins", id: "Groups" }],
    }),
    // 获取分组列表
    getGroupsList: build.query({
      query: () => "/plugin/group/list/all",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: number }) => ({
                type: "Plugins" as const,
                id,
              })),
              { type: "Plugins", id: "Groups" },
            ]
          : [{ type: "Plugins", id: "Groups" }],
    }),
    // 删除分组
    deleteGroups: build.mutation({
      query: (id: number) => ({ url: `/plugin/group/${id}`, method: "delete" }),
      invalidatesTags: [{ type: "Plugins", id: "Groups" }],
    }),
    // 通过code获取插件
    getEditPlugins: build.mutation({
      query: (code: string) => ({ url: `/plugin/code/${code}`, method: "get" }),
    }),
    //  升级插件版本
    upgradePlugins: build.mutation({
      query: (params: any) => ({
        url: "/plugin/version",
        method: "post",
        body: params,
      }),
    }),
    // 批量授权
    batchAssignAuth: build.mutation({
      query: (params: any) => ({
        url: "/plugin/batch/binding",
        method: "post",
        body: params,
      }),
    }),
    // 指定授权
    singleAssignAuth: build.mutation({
      query: (params: any) => ({
        url: "/plugin/binding",
        method: "post",
        body: params,
      }),
    }),
    // 查询当前插件已绑定的租户
    getBindingTenant: build.query({
      query: (id: number) => `/plugin/binding/${id}`,
    }),
    // 启用禁用插件
    enablePlugins: build.query({
      query: (params: { id: number; flag: boolean }) => ({
        url: "/plugin/enable",
        method: "get",
        params,
      }),
    }),
    // 公开不公开插件
    openVisitPlugins: build.query({
      query: (params: { id: number; flag: boolean }) => ({
        url: "/plugin/open/visit",
        method: "get",
        params,
      }),
    }),
    // 查看json
    getJson: build.query({
      query: (code: string) => `/plugin/code/${code}`,
    }),
    // 验证插件code是否唯一
    verifyCodeUnique: build.query({
      query: (code: string) => `/plugin/add/verify/${code}`,
    }),
    //  验证插件code是否一致
    verifyCodeConsistent: build.mutation({
      query: (params: any) => ({
        url: "plugin/upgrade/verify",
        method: "post",
        body: params,
      }),
    }),
  }),
  // overrideExisting: false,
});

export const {
  useAddGroupsMutation,
  useEditGroupsMutation,
  useGetGroupsListQuery,
  useAddPluginsMutation,
  useEditPluginsMutation,
  useLazyGetPluginsListQuery,
  useDeleteGroupsMutation,
  useGetEditPluginsMutation,
  useUpgradePluginsMutation,
  useBatchAssignAuthMutation,
  useSingleAssignAuthMutation,
  useLazyGetBindingTenantQuery,
  useLazyEnablePluginsQuery,
  useLazyOpenVisitPluginsQuery,
  useLazyGetJsonQuery,
  useLazyVerifyCodeUniqueQuery,
  useVerifyCodeConsistentMutation,
} = assetCentreBuilder;
