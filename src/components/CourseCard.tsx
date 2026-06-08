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
      <div className="grid grid-cols-1 gap-2">
        {courses.map((course) => (
          <div className="bg-white rounded-md overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-shadow duration-300">
            {/* IMAGE */}
            <div className="h-40 w-full">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
