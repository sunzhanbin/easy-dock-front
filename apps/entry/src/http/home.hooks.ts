import baseFetch from "@utils/fetch";

export const homeManage = baseFetch.injectEndpoints({
  endpoints: (build) => ({
    logout: build.query({
      query: () =>
        ({
          url: "/app",
          method: "post",
        } as any),
    }),
    getProjectList: build.query({
      query: () => "/project/list/all",
    }),
  }),
});

export const { useGetProjectListQuery, useLazyLogoutQuery } = homeManage;
