import { useGetCourseByIdQuery } from "@/features/courses/courseApiSlice";
import { useGetProgressQuery } from "@/features/progress/progressApiSlice";
import { useParams } from "react-router-dom";
import { type Lesson } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { PlayCircle } from "lucide-react";
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
  if (isCourseLoading || isProgressLoading) return <div>Loading...</div>;
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
  const getYoutubeThumbnail = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };
  const handleMarkComplete = async () => {
    try {
      const response = await mark({ courseId: id, lessonId }).unwrap();
      toast({
        title: `${response.message} 🎉`,
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
          <div className="w-full bg-white p-3 rounded-md min-h-[300px] flex flex-col lg:hidden">
            <h1 className="text-black font-semibold">Course Content</h1>
            {lessons.map((lesson: Lesson) => (
              <div
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
                  className="bg-white rounded-full h-2 transition-all duration-300"
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
        <div className="w-full bg-white p-3 rounded-md min-h-[300px] lg:flex flex-col hidden shadow-2xl ">
          <h1 className="text-black font-semibold">Course Content</h1>
          {lessons.map((lesson: Lesson) => (
            <div
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
                className="bg-white rounded-full h-2 transition-all duration-300"
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
