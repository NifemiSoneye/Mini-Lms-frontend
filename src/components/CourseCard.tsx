import React from "react";
import { type EntityState } from "@reduxjs/toolkit";
import { type Course } from "@/lib/types";
import { Button } from "./ui/button";
import { useEnrollInCourseMutation } from "@/features/progress/progressApiSlice";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
type Props = {
  courses: Course[];
  isLoading: boolean;
};

export default function CourseCard({ courses, isLoading }: Props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [enroll, { isLoading: isEnrollLoading }] = useEnrollInCourseMutation();
  console.log(courses);
  const handleEnroll = async (courseId: string) => {
    try {
      await enroll(courseId).unwrap();
      toast({
        title: "Enrolled successfully! 🎉",
        description: "Course added to your list",
      });
    } catch (err: any) {
      toast({
        variant: "default",
        title: "Error! 🎉",
        description: "Enroll Error",
      });
    }
  };

  const CourseCardSkeleton = () => {
    return (
      <div className="bg-white rounded-md overflow-hidden p-4">
        <Skeleton className="h-40 w-full rounded-md" />
        <Skeleton className="h-3 w-24 mt-3" />
        <Skeleton className="h-5 w-3/4 mt-2" />
        <Skeleton className="h-3 w-1/3 mt-2" />
        <Skeleton className="h-9 w-full mt-3" />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 my-3 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-black text-[1.5rem] font-medium">
          No Courses available. Check again later.
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 my-3">
        {courses.map((course) => (
          <div className="bg-white rounded-md overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-shadow duration-300 p-4 min-w-0">
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

            <div>
              <Button
                variant="default"
                className="text-blue-500 bg-blue-100 w-full my-2 rounded-sm"
                onClick={() => handleEnroll(course.id)}
              >
                Enroll
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
