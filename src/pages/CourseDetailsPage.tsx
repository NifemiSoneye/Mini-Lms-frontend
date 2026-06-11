import { useGetCourseByIdQuery } from "@/features/courses/courseApiSlice";
import { useGetProgressQuery } from "@/features/progress/progressApiSlice";
import { useParams } from "react-router-dom";
import { type Lesson } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { UsersRound } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: courseData, isLoading: isCourseLoading } =
    useGetCourseByIdQuery(id);
  const { data: progressData, isLoading: isProgressLoading } =
    useGetProgressQuery({ courseId: id });
  function CourseDetailsSkeleton() {
    return (
      <div className="mx-4 lg:grid lg:grid-cols-[1.5fr_1fr] gap-5">
        <div>
          {/* Thumbnail */}
          <Skeleton className="my-4 h-48 md:h-80 rounded-xl w-full bg-gray-200" />

          {/* Mobile text */}
          <div className="md:hidden space-y-2 mb-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Progress card mobile */}
          <Skeleton className="h-36 w-full rounded-lg my-3 md:hidden" />

          {/* Lesson list */}
          <div className="bg-white rounded-md shadow-xl p-3 space-y-3">
            <Skeleton className="h-6 w-36" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 p-2">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress card desktop */}
        <div className="hidden md:block lg:mx-5 my-1 bg-gray-200 h-[50%]">
          <Skeleton className="h-64 w-full rounded-lg my-3" />
        </div>
      </div>
    );
  }

  if (isCourseLoading || isProgressLoading) return <CourseDetailsSkeleton />;

  const { course, lessons } = courseData;
  const completedLessons = progressData?.completedLessons ?? [];
  const totalLessons = lessons.length;
  const nextLesson: Lesson = lessons.find(
    (lesson: Lesson) => !completedLessons.includes(lesson._id),
  );
  const thisYear = new Date().getFullYear();
  return (
    <>
      <div className="mx-4 md:grid lg:grid-cols-[1.5fr_1fr] gap-5">
        <div>
          <div className="relative my-4 h-48 md:h-80 rounded-xl overflow-hidden shadow-xl animate-fade-slide-up">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="h-full w-full object-cover"
            />
            {/* overlay - only visible on md+ */}
            <div className="hidden md:flex absolute inset-0 bg-black/50 flex-col justify-end p-6">
              <p className="text-blue-300 font-semibold uppercase text-sm">
                {course.category}
              </p>
              <p className="text-white font-semibold text-3xl my-2">
                {course.title}
              </p>
              <p className="text-gray-200 text-[1rem]">{course.description}</p>
            </div>
          </div>

          {/* text below image - only visible on mobile */}
          <div className="md:hidden">
            <p className="text-blue-700 font-semibold uppercase">
              {course.category}
            </p>
            <p className="text-black font-semibold text-2xl my-2">
              {course.title}
            </p>
            <p className="text-[1rem] text-gray-700">{course.description}</p>
          </div>
          <div className="bg-blue-600 rounded-lg border border-gray-100 p-4  text-white md:max-w-[50%] my-3 md:hidden">
            <p className="text-sm text-blue-200 my-1">Current Progress</p>
            <p className="text-lg">
              {completedLessons.length} of {lessons.length} Lessons <br />{" "}
              complete
            </p>
            {/* Progress Bar */}
            <div className="w-full bg-blue-400 rounded-full h-2 my-3 ">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{
                  width: `${Math.round(
                    (completedLessons.length / lessons.length) * 100,
                  )}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-sm mb-1">
              <p>
                {Math.round((completedLessons.length / lessons.length) * 100)}%
                Complete
              </p>
            </div>
            <Button
              variant="link"
              onClick={() =>
                navigate(`/courses/${id}/lessons/${nextLesson?._id}`)
              }
              className="w-full bg-white text-blue-700 my-1 rounded-md"
            >
              Continue Learning
            </Button>
          </div>
          <section>
            <p className="text-black font-semibold text-xl mb-2 md:hidden">
              Course Content
            </p>
            <div className="bg-white w-full rounded-md grid grid-cols-1 gap-3 shadow-xl">
              <p className="text-black font-semibold text-xl hidden md:block p-3">
                Course Content
              </p>
              {lessons.map((lesson: Lesson, index: number) => (
                <div
                  key={lesson._id}
                  style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
                  className={`flex items-center gap-2 p-2 animate-fade-slide-up ${
                    lesson._id === nextLesson?._id
                      ? "bg-blue-100 border-t-2 border-t-blue-400"
                      : null
                  } ${
                    completedLessons.includes(lesson._id) ||
                    lesson._id === nextLesson?._id
                      ? "cursor-pointer hover:bg-gray-50"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (
                      completedLessons.includes(lesson._id) ||
                      lesson._id === nextLesson?._id
                    ) {
                      navigate(`/courses/${id}/lessons/${lesson._id}`);
                    }
                  }}
                >
                  <div
                    className={`h-8 w-8  rounded-full flex items-center p-2  ${
                      completedLessons.includes(lesson._id)
                        ? "bg-green-100"
                        : lesson._id === nextLesson?._id
                          ? "bg-blue-700"
                          : "border border-gray-500"
                    }`}
                  >
                    {completedLessons.includes(lesson._id) ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : lesson._id === nextLesson?._id ? (
                      <PlayCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div>
                    <p className="text-black text-sm font-medium">
                      Lesson {lesson.order}
                    </p>
                    <p className="text-black text-sm font-medium">
                      {lesson.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <div className="flex items-center flex-col my-3 md:hidden">
            <div className="bg-blue-700 w-8 h-8 rounded-full p-2 flex items-center">
              <UsersRound className="w-5 h-5 text-white" />
            </div>

            <p className="text-gray-500 italic text-[1rem]">
              Join multiple Students enrolled in this path
            </p>
          </div>
        </div>
        <div className="hidden md:block lg:mx-5 my-1 ">
          <div className="bg-blue-600 rounded-lg border border-gray-100 p-5  text-white my-3 shadow-2xl">
            <p className="text-sm text-blue-200 my-1">Current Progress</p>
            <p className="text-lg">
              {completedLessons.length} of {lessons.length} Lessons complete
            </p>
            {/* Progress Bar */}
            <div className="w-full bg-blue-400 rounded-full h-2 my-3 ">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{
                  width: `${Math.round(
                    (completedLessons.length / lessons.length) * 100,
                  )}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-sm mb-1">
              <p>
                {completedLessons.length
                  ? Math.round((completedLessons.length / lessons.length) * 100)
                  : 0}
                % Complete
              </p>
            </div>
            <Button
              variant="link"
              disabled={!nextLesson}
              onClick={() =>
                navigate(`/courses/${id}/lessons/${nextLesson?._id}`)
              }
              className="w-full bg-white text-blue-700 my-1 rounded-md"
            >
              Continue Learning
            </Button>
            <div className="hidden md:flex justify-between mt-4">
              <div className="text-center">
                <p className="text-white text-2xl font-bold">
                  {completedLessons.length}
                </p>
                <p className="text-blue-200 text-xs uppercase">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-white text-2xl font-bold">
                  {lessons.length - completedLessons.length}
                </p>
                <p className="text-blue-200 text-xs uppercase">Remaining</p>
              </div>
              <div className="text-center">
                <p className="text-white text-2xl font-bold">
                  {completedLessons.length
                    ? Math.round(
                        (completedLessons.length / lessons.length) * 100,
                      )
                    : 0}
                  %
                </p>
                <p className="text-blue-200 text-xs uppercase">Complete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
