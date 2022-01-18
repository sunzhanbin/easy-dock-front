import baseFetch from "@utils/fetch";

export const assetCentre = baseFetch.injectEndpoints({
  endpoints: (build) => ({
    addAsset: build.mutation({
      query: (params?: { name: string; projectId: number }) => ({
        url: "/app",
        method: "post",
        body: params,
      }),
      // invalidatesTags: ['AssetCentre']
    }),
  }),
  // overrideExisting: false,
});

export const { useAddAssetMutation } = assetCentre;
