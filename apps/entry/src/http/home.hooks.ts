import baseFetch, { runTime } from "@utils/fetch";
import { AssignAuthParams, ProjectPower, RevokeAuthParams } from "@utils/types";

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
      query: (params: { name: string }) => ({
        url: "/project",
        method: "post",
        body: params,
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),
    deleteProject: build.mutation({
      query: (id: number) => ({
        url: `/project/${id}`,
        method: "delete",
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),
    editProject: build.mutation({
      query: (params: { name: string; id: number }) => ({
        url: "/project",
        method: "put",
        body: params,
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),
    getRecentList: build.mutation({
      query: (params: { id: number; size: number }) => ({
        url: `project/list/recent/${params.id}`,
        method: "get",
        params,
      }),
    }),
    fetchProjectPowers: build.query<ProjectPower[], void>({
      query: () => ({
        url: "/project/list/all/powers",
        method: "get",
      }),
    }),
  }),
});

export const {
  useGetProjectListQuery,
  useLazyFetchProjectPowersQuery,
  useNewProjectMutation,
  useGetRecentListMutation,
  useDeleteProjectMutation,
  useEditProjectMutation,
} = homeManageBuilder;

export const homeManageRuntime = runTime.injectEndpoints({
  endpoints: (build) => ({
    getUserInfo: build.query({
      query: () => ({
        url: "/auth/current",
        method: "get",
        silence: true,
      }),
    }),
    getWorkspaceList: build.query<any[], void>({
      query: () => ({
        url: "/app/list/all",
        method: "get",
      }),
    }),
    fetchAllUser: build.mutation({
      query: (params: { index: number; size: number; keyword: string }) => ({
        url: "/user/search/all",
        method: "post",
        body: params,
      }),
    }),
    assignAuth: build.mutation({
      query: (params: AssignAuthParams) => ({
        url: "/privilege/assign",
        method: "post",
        body: params,
      }),
    }),
    revokeAuth: build.mutation({
      query: (params: RevokeAuthParams) => ({
        url: "/privilege/revoke",
        method: "delete",
        body: params,
      }),
    }),
  }),
});

export const {
  useGetUserInfoQuery,
  useGetWorkspaceListQuery,
  useFetchAllUserMutation,
  useAssignAuthMutation,
  useRevokeAuthMutation,
} = homeManageRuntime;
