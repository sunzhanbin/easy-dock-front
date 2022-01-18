import baseFetch from "@utils/fetch";

export const templateMail = baseFetch.injectEndpoints({
  endpoints: (build) => ({
    addTemplate: build.mutation({
      query: (params?: { name: string; projectId: number }) => ({
        url: "/app",
        method: "post",
        body: params,
      }),
      // invalidatesTags: ['TemplateMail']
    }),
  }),
  // overrideExisting: false,
});

export const { useAddTemplateMutation } = templateMail;
