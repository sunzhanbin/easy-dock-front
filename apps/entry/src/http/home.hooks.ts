import baseFetch, { runTime } from "@utils/fetch";

export const homeManageBuilder = baseFetch.injectEndpoints({
  endpoints: (build) => ({
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
      query: (params: { name: string }) =>
        ({
          url: "/project",
          method: "post",
          data: params,
        } as any),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),
    deleteProject: build.mutation({
      query: (id: number) =>
        ({
          url: `/project/${id}`,
          method: "delete",
        } as any),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),
    editProject: build.mutation({
      query: (params: { name: string; id: number }) =>
        ({
          url: "/project",
          method: "put",
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
  useNewProjectMutation,
  useGetRecentListMutation,
  useDeleteProjectMutation,
  useEditProjectMutation,
} = homeManageBuilder;

export const homeManageRuntime = runTime.injectEndpoints({
  endpoints: (build) => ({
    getUserInfo: build.query({
      query: () =>
        ({
          url: "/auth/current",
          method: "get",
          silence: true,
        } as any),
    }),
  }),
});

export const { useGetUserInfoQuery } = homeManageRuntime;
