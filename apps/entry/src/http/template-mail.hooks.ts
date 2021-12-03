import baseFetch from "@utils/fetch";

export const templateMail = baseFetch.injectEndpoints({
  endpoints: (build) => ({
    addTemplate: build.mutation({
      query: (params?: { name: string; projectId: number }) =>
        ({
          url: "/app",
          method: "post",
          data: params,
        } as any),
      // invalidatesTags: ['TemplateMail']
    }),
  }),
  // overrideExisting: false,
});

export const { useAddTemplateMutation } = templateMail;
