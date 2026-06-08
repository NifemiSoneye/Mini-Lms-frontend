import React from "react";
import { useSearchParams } from "react-router-dom";
import { useGetCoursesQuery } from "@/features/courses/courseApiSlice";
import { useGetMyCoursesQuery } from "@/features/progress/progressApiSlice";
import CourseCard from "@/components/CourseCard";
import { useSelector } from "react-redux";
import { selectAllCourses } from "@/features/courses/courseApiSlice";
import EnrolledCourseCard from "@/components/EnrolledCourseCard";

export default function CoursePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "My Courses";
  const { data: allCoursesData, isLoading: allLoading } =
    useGetCoursesQuery(undefined);
  const { data: myCoursesData, isLoading: myCoursesLoading } =
    useGetMyCoursesQuery(undefined);
  const allCourses = allCoursesData?.entities
    ? Object.values(allCoursesData.entities)
    : [];
  const myCourses = myCoursesData ? myCoursesData : [];

  type Tab = "My Courses" | "All Courses";

  const setTab = (tab: Tab) => {
    setSearchParams({ tab }, { replace: true });
  };
  return (
    <>
      <div className="flex border-b border-[#292c33] gap-2">
        {(["My Courses", "All Courses"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setTab(tab)}
            className={`flex-1 flex items-center justify-center gap-5 py-3 text-[0.78rem] font-medium border-b transition-colors
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
      {activeTab === "All Courses" && (
        <CourseCard courses={allCourses} isLoading={allLoading} />
      )}
      {activeTab === "My Courses" && (
        <EnrolledCourseCard
          progressDocs={myCourses}
          isLoading={myCoursesLoading}
        />
      )}
      ;
    </>
  );
}
