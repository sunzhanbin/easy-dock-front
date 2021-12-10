import baseFetch from "@utils/fetch";

export const homeManage = baseFetch.injectEndpoints({
  endpoints: (build) => ({
    logout: build.mutation({
      query: (params?: { name: string; projectId: number }) =>
        ({
          url: "/app",
          method: "post",
          data: params,
        } as any),
    }),
  }),
});

export const { useLogoutMutation } = homeManage;
