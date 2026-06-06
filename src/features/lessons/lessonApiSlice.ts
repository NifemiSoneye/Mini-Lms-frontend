import { apiSlice } from "@/api/apiSlice";

export const lessonsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addLesson: builder.mutation({
      query: ({ courseId, ...lessonData }) => ({
        url: `/courses/${courseId}/lessons`,
        method: "POST",
        body: lessonData,
      }),
      invalidatesTags: [{ type: "Lesson", id: "LIST" }],
    }),
    updateLesson: builder.mutation({
      query: ({ courseId, lessonId, ...lessonData }) => ({
        url: `/courses/${courseId}/lessons/${lessonId}`,
        method: "PATCH",
        body: lessonData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Course", id: arg.id },
        { type: "Course", id: "LIST" },
      ],
    }),
    deleteLesson: builder.mutation({
      query: ({ courseId, lessonId }) => ({
        url: `/courses/${courseId}/lessons/${lessonId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Course", id: arg.id },
        { type: "Course", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useAddLessonMutation,
  useDeleteLessonMutation,
  useUpdateLessonMutation,
} = lessonsApiSlice;
