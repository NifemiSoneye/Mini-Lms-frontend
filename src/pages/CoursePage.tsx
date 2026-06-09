import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetCoursesQuery } from "@/features/courses/courseApiSlice";
import { useGetMyCoursesQuery } from "@/features/progress/progressApiSlice";
import CourseCard from "@/components/CourseCard";
import { useSelector } from "react-redux";
import { selectAllCourses } from "@/features/courses/courseApiSlice";
import EnrolledCourseCard from "@/components/EnrolledCourseCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CoursePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "My Courses";
  const { data: allCoursesData, isLoading: allLoading } =
    useGetCoursesQuery(undefined);
  const { data: myCoursesData, isLoading: myCoursesLoading } =
    useGetMyCoursesQuery(undefined);
  const [page, setPage] = useState(1);
  const coursesPerPage = 3;
  const allCourses = allCoursesData?.entities
    ? Object.values(allCoursesData.entities)
    : [];
  const myCourses = myCoursesData ? myCoursesData : [];
  const enrolledCourseIds = myCourses.map((doc) => doc.course._id);
  const unenrolledCourses = allCourses.filter(
    (course: any) => !enrolledCourseIds.includes(course._id),
  );

  const allCategories = [
    "All",
    ...new Set(allCourses.map((c: any) => c.category)),
  ];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredUnenrolled =
    activeCategory === "All"
      ? unenrolledCourses
      : unenrolledCourses.filter((c: any) => c.category === activeCategory);

  const filteredMyCourses =
    activeCategory === "All"
      ? myCourses
      : myCourses.filter((doc) => doc.course.category === activeCategory);
  const paginatedUnenrolled = filteredUnenrolled.slice(
    (page - 1) * coursesPerPage,
    page * coursesPerPage,
  );

  const paginatedMyCourses = filteredMyCourses.slice(
    (page - 1) * coursesPerPage,
    page * coursesPerPage,
  );

  const totalPages =
    activeTab === "All Courses"
      ? Math.ceil(filteredUnenrolled.length / coursesPerPage)
      : Math.ceil(filteredMyCourses.length / coursesPerPage);

  type Tab = "My Courses" | "All Courses";

  const setTab = (tab: Tab) => {
    setSearchParams({ tab }, { replace: true });
    setPage(1);
  };
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setPage(1);
  };
  const latestCourse = myCourses[myCourses.length - 1];
  return (
    <div className="w-full overflow-x-hidden flex flex-col gap-3">
      {latestCourse ? (
        <div className="bg-blue-600 rounded-md border border-gray-100 p-4  text-white md:max-w-[50%]">
          <p className="text-sm text-blue-200">Current Progress</p>
          <p className="text-xl font-bold mt-1">{latestCourse.course.title}</p>

          {/* Progress Bar */}
          <div className="w-full bg-blue-400 rounded-full h-2 my-3 ">
            <div
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{
                width: `${Math.round(
                  (latestCourse.completedLessons.length /
                    latestCourse.course.lessonCount) *
                    100,
                )}%`,
              }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <p>
              {latestCourse.completedLessons.length} of{" "}
              {latestCourse.course.lessonCount} Lessons
            </p>
            <p>
              {Math.round(
                (latestCourse.completedLessons.length /
                  latestCourse.course.lessonCount) *
                  100,
              )}
              % Complete
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-blue-600 rounded-md border border-gray-100 p-4  text-white md:max-w-[50%]">
          <p className="text-sm text-blue-200">Get Started</p>
          <p className="text-xl font-bold mt-1">
            You have no enrolled courses yet
          </p>
          <p className="text-sm text-blue-200 mt-2">
            Browse all courses and start learning today
          </p>
        </div>
      )}
      <div className="flex border-b border-gray-200 gap-2">
        {(["My Courses", "All Courses"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setTab(tab)}
            className={`flex-1 flex items-center justify-center gap-5 py-1 text-[0.78rem] font-medium border-b transition-colors
                  ${
                    activeTab === tab
                      ? "text-blue-500 border-blue-600"
                      : "text-gray-800 border-transparent"
                  }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 px-3 py-1">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={` p-1.5 rounded-full text-sm font-medium transition-colors text-center w-full truncate
        ${
          activeCategory === category
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-700 border border-gray-300"
        }`}
          >
            {category}
          </button>
        ))}
      </div>
      {totalPages > 1 && (
        <div className=" flex items-center gap-4 my-1 mx-3 justify-end min-w-0 ">
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
      {activeTab === "All Courses" && (
        <div className="w-full overflow-hidden">
          <CourseCard courses={paginatedUnenrolled} isLoading={allLoading} />
        </div>
      )}
      {activeTab === "My Courses" && (
        <div className="w-full overflow-hidden">
          <EnrolledCourseCard
            progressDocs={paginatedMyCourses}
            isLoading={myCoursesLoading}
          />
        </div>
      )}
    </div>
  );
}
