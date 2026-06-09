import { useGetCourseByIdQuery } from "@/features/courses/courseApiSlice";
import { useGetProgressQuery } from "@/features/progress/progressApiSlice";
import { useParams } from "react-router-dom";
import { type Lesson } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { PlayCircle, ChevronLeft } from "lucide-react";
import { useMarkLessonCompleteMutation } from "@/features/progress/progressApiSlice";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Lock, LockOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function VideoLessonPage() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>();
  if (!id || !lessonId) return null;
  const { data: courseData, isLoading: isCourseLoading } =
    useGetCourseByIdQuery(id);
  const { data: progressData, isLoading: isProgressLoading } =
    useGetProgressQuery({ courseId: id });
  const [mark, { isLoading: isMarkedLoading }] =
    useMarkLessonCompleteMutation();
  const { toast } = useToast();
  const navigate = useNavigate();

  function VideoLessonSkeleton() {
    return (
      <div className="lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-5 m-4">
        <div className="flex flex-col gap-3">
          <Skeleton className="w-full aspect-video lg:h-[60vh] rounded-xl bg-white" />

          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-2/3" />

          <Skeleton className="h-11 w-full rounded-sm" />

          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-11 rounded-sm" />
            <Skeleton className="h-11 rounded-sm" />
          </div>

          <div className="lg:hidden bg-white rounded-md p-3 flex flex-col gap-2 min-h-[300px]">
            <Skeleton className="h-4 w-28" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-1">
                <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                <div className="flex flex-col gap-1 flex-1">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
            <div className="mt-auto pt-3 border-t border-gray-200 flex flex-col gap-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-2 bg-white rounded-md p-3 min-h-[300px]">
          <Skeleton className="h-4 w-28" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-1">
              <Skeleton className="h-6 w-6 rounded-full shrink-0" />
              <div className="flex flex-col gap-1 flex-1">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
          <div className="mt-auto pt-3 border-t border-gray-200 flex flex-col gap-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }
  if (isCourseLoading || isProgressLoading) return <VideoLessonSkeleton />;
  if (!courseData) return null;
  const { course, lessons } = courseData;
  const completedLessons = progressData?.completedLessons ?? [];
  const currentIndex = lessons.findIndex((l: Lesson) => l._id === lessonId);
  const currentLesson: Lesson = lessons[currentIndex];
  const prevLesson: Lesson | undefined = lessons[currentIndex - 1];
  const nextLesson: Lesson | undefined = lessons[currentIndex + 1];
  const isCompleted = completedLessons.includes(lessonId);
  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };
  /* const getYoutubeThumbnail = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }; */
  const handleMarkComplete = async () => {
    try {
      const response = await mark({ courseId: id, lessonId }).unwrap();
      toast({
        title: "Success 🎉",
        description: "Lesson Completed",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Could not complete lesson",
      });
    }
  };

  return (
    <div className="lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-5 m-4">
      <div>
        <button
          onClick={() => navigate(`/courses/${id}`)}
          className="flex items-center gap-1 text-blue-600 text-sm mb-3 lg:hidden"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Course
        </button>
        <div className="relative w-full aspect-video lg:rounded-xl overflow-hidden rounded-md lg:h-[60vh] shadow-2xl ">
          <iframe
            src={getYoutubeEmbedUrl(currentLesson.youtubeUrl)}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
        <section className="my-3">
          <p className="text-gray-700 uppercase text-[1rem]">
            Lesson {currentLesson.order}
          </p>
          <h1 className="text-2xl font-medium my-2">{currentLesson.title}</h1>

          {isCompleted ? (
            <Button disabled className="w-full bg-gray-200 text-gray-500 p-5">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Completed ✓
            </Button>
          ) : (
            <Button
              className="w-full bg-blue-600 text-white mt-3 rounded-sm p-5"
              onClick={handleMarkComplete}
              disabled={isMarkedLoading}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          )}
          <div className="grid grid-cols-2 items-center gap-3 my-4 ">
            <Button
              className="bg-white p-4 text-blue-700 rounded-sm border border-gray-400"
              disabled={!prevLesson}
              onClick={() =>
                prevLesson &&
                navigate(`/courses/${id}/lessons/${prevLesson._id}`)
              }
            >
              Previous
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* span needed because tooltip won't work on a disabled button directly */}
                  <span className="w-full">
                    <Button
                      className="w-full bg-white p-4 text-blue-700 rounded-sm border border-gray-400"
                      disabled={!nextLesson || !isCompleted}
                      onClick={() =>
                        nextLesson &&
                        navigate(`/courses/${id}/lessons/${nextLesson._id}`)
                      }
                    >
                      Next
                    </Button>
                  </span>
                </TooltipTrigger>
                {!isCompleted && (
                  <TooltipContent>
                    <p>Complete this lesson to proceed</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="w-full bg-white p-3 rounded-md min-h-[300px] flex flex-col lg:hidden shadow-2xl">
            <h1 className="text-black font-semibold">Course Content</h1>
            {lessons.map((lesson: Lesson) => (
              <div
                key={lesson._id}
                className={`flex items-center my-2 px-3 py-1 ${
                  lesson._id === currentLesson._id
                    ? "bg-blue-700/20 rounded-md"
                    : ""
                }`}
              >
                {lesson._id === currentLesson._id ? (
                  <PlayCircle className="w-6 h-6 mr-2 text-blue-700" />
                ) : completedLessons.includes(lesson._id) ? (
                  <CheckCircle2 className="w-6 h-6 mr-2 text-blue-700" />
                ) : lesson._id === nextLesson?._id && isCompleted ? (
                  <LockOpen className="w-6 h-6 mr-2 text-gray-500" />
                ) : (
                  <Lock className="w-6 h-6 mr-2 text-gray-500" />
                )}
                <div>
                  <p className="text-sm text-gray-700">
                    Lesson :{lesson.order}
                  </p>
                  <p>{lesson.title}</p>
                </div>
              </div>
            ))}
            <div className="border-t border-t-gray-400 mt-auto pt-3">
              <div className="flex items-center justify-between">
                <p className="text-gray-700">Course Progress</p>
                <p className="text-blue-700 font-semibold">
                  {Math.round((completedLessons.length / lessons.length) * 100)}
                  %
                </p>
              </div>
              <div className="w-full bg-blue-400 rounded-full h-2 my-3 ">
                <div
                  className="bg-blue-900 rounded-full h-2 transition-all duration-300"
                  style={{
                    width: `${Math.round((completedLessons.length / lessons.length) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <div>
        <Button
          variant="link"
          onClick={() => navigate(`/courses/${id}`)}
          className=" items-center gap-1 text-blue-600 text-sm mb-3 hidden lg:flex hover:no-underline hover:cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Course
        </Button>
        <div className="w-full bg-white p-3 rounded-md min-h-[300px] lg:flex flex-col hidden shadow-2xl ">
          <h1 className="text-black font-semibold">Course Content</h1>
          {lessons.map((lesson: Lesson) => (
            <div
              key={lesson._id}
              className={`flex items-center my-2 px-3 py-1 ${
                lesson._id === currentLesson._id
                  ? "bg-blue-700/20 rounded-md"
                  : ""
              }`}
            >
              {lesson._id === currentLesson._id ? (
                <PlayCircle className="w-6 h-6 mr-2 text-blue-700" />
              ) : completedLessons.includes(lesson._id) ? (
                <CheckCircle2 className="w-6 h-6 mr-2 text-blue-700" />
              ) : lesson._id === nextLesson?._id && isCompleted ? (
                <LockOpen className="w-6 h-6 mr-2 text-gray-500" />
              ) : (
                <Lock className="w-6 h-6 mr-2 text-gray-500" />
              )}
              <div>
                <p className="text-sm text-gray-700">Lesson :{lesson.order}</p>
                <p>{lesson.title}</p>
              </div>
            </div>
          ))}
          <div className="border-t border-t-gray-400 mt-auto pt-3">
            <div className="flex items-center justify-between">
              <p className="text-gray-700">Course Progress</p>
              <p className="text-blue-700 font-semibold">
                {Math.round((completedLessons.length / lessons.length) * 100)}%
              </p>
            </div>
            <div className="w-full bg-blue-400 rounded-full h-2 my-3 ">
              <div
                className="bg-blue-900 rounded-full h-2 transition-all duration-300"
                style={{
                  width: `${Math.round((completedLessons.length / lessons.length) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
