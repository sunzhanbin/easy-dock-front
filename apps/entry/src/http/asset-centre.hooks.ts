import baseFetch from "@utils/fetch";

export const assetCentre = baseFetch.injectEndpoints({
  endpoints: (build) => ({
    addPlugins: build.mutation({
      query: (params: any) => ({
        url: "/plugin",
        method: "post",
        body: params,
      }),
      invalidatesTags: [{ type: "Plugins", id: "LIST" }],
    }),
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
    editPlugins: build.mutation({
      query: (params: any) => ({
        url: "/plugin",
        method: "put",
        body: params,
      }),
      invalidatesTags: [{ type: "Plugins", id: "LIST" }],
    }),
  }),
  // overrideExisting: false,
});

export const { useAddPluginsMutation, useEditPluginsMutation, useGetPluginsListQuery } = assetCentre;
