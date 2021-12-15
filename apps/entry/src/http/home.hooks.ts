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
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: number }) => ({
                type: "Project" as const,
                id,
              })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
    }),
    newProject: build.mutation({
      query: (params: { name: number }) =>
        ({
          url: "/project",
          method: "post",
          data: params,
        } as any),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),
    getRecentList: build.mutation({
      query: (projectId: number) => `project/list/recent/${projectId}`,
    }),
  }),
});

export const {
  useGetProjectListQuery,
  useLazyLogoutQuery,
  useNewProjectMutation,
  useGetRecentListMutation,
} = homeManage;
