import { apiSlice } from "@/api/apiSlice";

export const progressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProgress: builder.query({
      query: ({ courseId }) => ({
        url: `/progress/${courseId}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result, error, courseId) => [
        { type: "Progress", id: courseId },
      ],
    }),
    markLessonComplete: builder.mutation({
      query: ({ courseId, lessonId }) => ({
        url: `/progress/${courseId}/lessons/${lessonId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, courseId) => [
        { type: "Progress", id: courseId },
        { type: "Course", id: "LIST" },
      ],
    }),
  }),
});

export const { useGetProgressQuery, useMarkLessonCompleteMutation } =
  progressApiSlice;
