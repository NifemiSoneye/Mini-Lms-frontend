import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/api/apiSlice";
import { type RootState } from "../../app/store";
import { type Course } from "@/lib/types";

const coursesAdapter = createEntityAdapter<Course>({});

const initialState = coursesAdapter.getInitialState();

export const coursesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => ({
        url: `/courses`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedCourses = responseData.map((course: Course) => {
          course.id = course._id;
          return course;
        });
        return coursesAdapter.setAll(initialState, loadedCourses);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Course" as const, id: "LIST" },
            ...result.ids.map((id) => ({ type: "Course" as const, id })),
          ];
        } else return [{ type: "Course" as const, id: "LIST" }];
      },
    }),
    getCourseById: builder.query({
      query: (id) => `/courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),
    createCourse: builder.mutation({
      query: (initialCourse) => ({
        url: "/courses",
        method: "POST",
        body: {
          ...initialCourse,
        },
      }),
      invalidatesTags: [{ type: "Course", id: "LIST" }],
    }),
    updateCourse: builder.mutation({
      query: (initialCourse) => ({
        url: `/courses/${initialCourse.id}`,
        method: "PATCH",
        body: {
          ...initialCourse,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Course", id: arg.id },
        { type: "Course", id: "LIST" },
      ],
    }),
    togglePublish: builder.mutation({
      query: (initialCourse) => ({
        url: `/courses/${initialCourse.id}/publish`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Course", id: arg.id },
        { type: "Course", id: "LIST" },
      ],
    }),
    deleteCourse: builder.mutation({
      query: ({ id }) => ({
        url: `/courses/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Course", id: arg.id },
        { type: "Course", id: "LIST" },
      ],
    }),
    getStats: builder.query({
      query: () => "/admin/stats",
      providesTags: [{ type: "Course", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetCourseByIdQuery,
  useGetCoursesQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useTogglePublishMutation,
  useGetStatsQuery,
} = coursesApiSlice;

// returns the query result object
export const selectCoursesResult =
  coursesApiSlice.endpoints.getCourses.select(1);

// creates memoized selector
const selectCoursesData = createSelector(
  selectCoursesResult,
  (coursesResult) => coursesResult.data, // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllCourses,
  selectById: selectCoursesById,
  selectIds: selectCourseIds,
  // Pass in a selector that returns the notes slice of state
} = coursesAdapter.getSelectors(
  (state: RootState) => selectCoursesData(state) ?? initialState,
);
