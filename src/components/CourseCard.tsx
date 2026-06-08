import React from "react";
import { type EntityState } from "@reduxjs/toolkit";
import { type Course } from "@/lib/types";

type Props = {
  courses: Course[];
  isLoading: boolean;
};

export default function CourseCard({ courses, isLoading }: Props) {
  console.log(courses);
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 m-3">
        {courses.map((course) => (
          <div className="bg-white rounded-md overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-shadow duration-300 p-4">
            {/* IMAGE */}
            <div className="h-40 w-full">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="h-full w-full object-cover rounded-md"
              />
            </div>
            <p className="text-blue-700  uppercase my-2 font-medium">
              {course.category}
            </p>
            <p className="text-black font-semibold text-[1.2rem]">
              {course.title}
            </p>
            <p className="text-gray-800  text-[0.875rem]">
              {course.lessonCount} lessons
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
