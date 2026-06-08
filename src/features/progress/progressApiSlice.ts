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
    getMyCourses: builder.query<any[], void>({
      query: () => "/progress/my-courses",
      providesTags: [{ type: "Progress", id: "LIST" }],
    }),
    enrollInCourse: builder.mutation({
      query: (courseId) => ({
        url: `/progress/${courseId}/enroll`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Progress", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProgressQuery,
  useMarkLessonCompleteMutation,
  useGetMyCoursesQuery,
  useEnrollInCourseMutation,
} = progressApiSlice;
