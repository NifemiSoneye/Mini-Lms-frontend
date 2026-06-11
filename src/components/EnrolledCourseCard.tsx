import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { useUnenrollFromCourseMutation } from "@/features/progress/progressApiSlice";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useState } from "react";
type ProgressDoc = {
  _id: string;
  completedLessons: string[];
  course: {
    _id: string;
    title: string;
    category: string;
    thumbnailUrl: string;
    lessonCount: number;
  };
};

type Props = {
  progressDocs: ProgressDoc[];
  isLoading: boolean;
};

export default function EnrolledCourseCard({ progressDocs, isLoading }: Props) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null);

  const [unenrollFromCourse, { isLoading: unEnrollLoading }] =
    useUnenrollFromCourseMutation();

  const handleUnenroll = async (courseId: string) => {
    try {
      setLoadingCourseId(courseId);
      await unenrollFromCourse(courseId).unwrap();
      toast({
        title: "Unenrolled successfully",
        description: "Course removed from your list",
      });
    } catch (err) {
      toast({
        variant: "default",
        title: "Error! 🎉",
        description: "Unenroll Error",
      });
    }
  };

  const EnrolledCourseCardSkeleton = () => {
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
          <EnrolledCourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (progressDocs.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-black text-[1.5rem] font-medium">
          No Courses match the description
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 my-3">
        {progressDocs.map((doc, index) => (
          <div
            key={doc._id}
            className="bg-white rounded-md overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-shadow duration-300 p-4  min-w-0 animate-fade-slide-up"
            style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
          >
            <div className="h-30 w-full">
              <img
                src={doc.course.thumbnailUrl}
                alt={doc.course.title}
                className="h-full w-full object-cover rounded-md"
              />
            </div>
            <p className="text-blue-700  uppercase my-1 font-medium">
              {doc.course.category}
            </p>
            <p className="text-black font-semibold text-[1rem]">
              {doc.course.title}
            </p>
            <p className="text-gray-800  text-[0.875rem]">
              {doc.course.lessonCount} lessons
            </p>

            <p className="text-gray-800 text-[0.875rem]">
              {doc.completedLessons.length
                ? Math.round(
                    (doc.completedLessons.length / doc.course.lessonCount) *
                      100,
                  )
                : 0}
              % complete
            </p>
            <div className="w-full grid grid-cols-2 gap-2 ">
              <Button
                variant="default"
                className="text-blue-500 bg-blue-100 w-full my-1 rounded-sm hover:bg-blue-300"
                onClick={() => navigate(`/courses/${doc.course._id}`)}
              >
                {doc.completedLessons.length === 0
                  ? "Begin Course"
                  : "Resume Course"}
              </Button>
              <Button
                variant="default"
                className="text-red-200 bg-red-700 w-full my-1 rounded-sm hover:bg-red-900"
                onClick={() => handleUnenroll(doc.course._id)}
              >
                {loadingCourseId === doc.course._id ? (
                  <Loader className="w-4 h-4 text-white animate-spin" />
                ) : (
                  "Unenroll"
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
