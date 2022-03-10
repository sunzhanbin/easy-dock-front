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
      query: () => "/plugin/list/all",
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
  }),
  // overrideExisting: false,
});

export const {
  useAddGroupsMutation,
  useEditGroupsMutation,
  useGetGroupsListQuery,
  useAddPluginsMutation,
  useEditPluginsMutation,
  useGetPluginsListQuery,
  useDeleteGroupsMutation,
} = assetCentreBuilder;
