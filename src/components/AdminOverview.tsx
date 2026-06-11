import { useGetStatsQuery } from "@/features/courses/courseApiSlice";
import { BookOpen, PlayCircle, UsersRound } from "lucide-react";
import { useGetAdminCoursesQuery } from "@/features/courses/courseApiSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminOverview() {
  const { data: stats, isLoading } = useGetStatsQuery(undefined);
  const { data: adminCourses = [], isLoading: isCoursesLoading } =
    useGetAdminCoursesQuery(undefined);
  const [page, setPage] = useState(1);
  const coursesPerPage = 3;

  const totalPages = Math.ceil(adminCourses.length / coursesPerPage);
  const paginatedCourses = adminCourses.slice(
    (page - 1) * coursesPerPage,
    page * coursesPerPage,
  );

  const AdminOverviewSkeleton = () => (
    <div className="mt-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={`bg-white rounded-xl p-4 shadow-sm ${i === 2 ? "col-span-2 lg:col-span-1" : ""}`}
          >
            <Skeleton className="w-10 h-10 rounded-lg mb-3" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24 mt-2" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm mt-6">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  if (isLoading) return <AdminOverviewSkeleton />;
  if (!stats) return null;

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm animate-fade-slide-up">
          <div
            style={{ animationDelay: "0s", opacity: 0 }}
            className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3 animate-fade-slide-up"
          >
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-black">{stats.totalCourses}</p>
          <p className="text-gray-500 text-sm mt-1">Total Courses</p>
        </div>

        <div
          style={{ animationDelay: "0.1s", opacity: 0 }}
          className="bg-white rounded-xl p-4 shadow-sm animate-fade-slide-up"
        >
          <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
            <PlayCircle className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-black">{stats.totalLessons}</p>
          <p className="text-gray-500 text-sm mt-1">Total Lessons</p>
        </div>

        <div
          style={{ animationDelay: "0.2s", opacity: 0 }}
          className="bg-white rounded-xl p-4 shadow-sm col-span-2 lg:col-span-1 animate-fade-slide-up"
        >
          <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
            <UsersRound className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-black">
            {stats.totalEnrollments}
          </p>
          <p className="text-gray-500 text-sm mt-1">Total Enrollments</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm mt-6">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-black font-semibold text-lg">Recent Courses</h2>
          {totalPages > 1 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="disabled:opacity-40"
              >
                <ChevronLeft className="w-5 h-5 text-blue-600" />
              </button>
              <p className="text-sm text-gray-600">
                {page} / {totalPages}
              </p>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="disabled:opacity-40"
              >
                <ChevronRight className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          )}
        </div>
        {isCoursesLoading ? (
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4">
                <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {paginatedCourses.map((course: any, index: number) => (
              <div
                key={course._id}
                style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
                className="flex items-center gap-3 p-4 animate-fade-slide-up"
              >
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-black font-medium truncate">
                    {course.title}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {course.category} • {course.lessonCount} Lessons
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                    course.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {course.isPublished ? "Published" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
