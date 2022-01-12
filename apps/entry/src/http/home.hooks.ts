import baseFetch, { runTime } from '@utils/fetch';

export const homeManageBuilder = baseFetch.injectEndpoints({
  endpoints: (build) => ({
    getProjectList: build.query({
      query: () => '/project/list/all',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: number }) => ({
                type: 'Project' as const,
                id,
              })),
              { type: 'Project', id: 'LIST' },
            ]
          : [{ type: 'Project', id: 'LIST' }],
    }),
    newProject: build.mutation({
      query: (params: { name: string }) => ({
        url: '/project',
        method: 'post',
        body: params,
      }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),
    deleteProject: build.mutation({
      query: (id: number) => ({
        url: `/project/${id}`,
        method: 'delete',
      }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),
    editProject: build.mutation({
      query: (params: { name: string; id: number }) => ({
        url: '/project',
        method: 'put',
        body: params,
      }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),
    getRecentList: build.mutation({
      query: (params: { id: number; size: number }) => ({
        url: `project/list/recent/${params.id}`,
        method: 'get',
        params,
      }),
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
      query: () => ({
        url: '/auth/current',
        method: 'get',
        silence: true,
      }),
    }),
  }),
});

export const { useGetUserInfoQuery } = homeManageRuntime;
