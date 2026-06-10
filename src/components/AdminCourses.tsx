import {
  useGetAdminCoursesQuery,
  useDeleteCourseMutation,
  useTogglePublishMutation,
  useUpdateCourseMutation,
  useCreateCourseMutation,
} from "@/features/courses/courseApiSlice";

export default function AdminCourses() {
  const { data: adminCourses, isLoading: isAdminCoursesLoading } =
    useGetAdminCoursesQuery(undefined);
  const [deleteCourse] = useDeleteCourseMutation();
  const [togglePublish] = useTogglePublishMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [createCourse] = useCreateCourseMutation();

  if (isAdminCoursesLoading) return <div>Loading...</div>;
  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {adminCourses?.map((course: any) => (
          <div
            key={course._id}
            className="bg-white rounded-xl overflow-hidden shadow-xl"
          >
            {/* thumbnail */}
            <div className="h-44 w-full">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </div>
            {/* course info */}
            <div className="p-4">
              <p className="text-blue-600 text-xs font-semibold uppercase">
                {course.category}
              </p>
              <p className="text-black font-semibold text-lg mt-1">
                {course.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
