import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
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
  const navigate = useNavigate();
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 m-3">
        {progressDocs.map((doc) => (
          <div
            key={doc._id}
            className="bg-white rounded-md overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-shadow duration-300 p-4"
          >
            {/* IMAGE */}
            <div className="h-40 w-full">
              <img
                src={doc.course.thumbnailUrl}
                alt={doc.course.title}
                className="h-full w-full object-cover rounded-md"
              />
            </div>
            <p className="text-blue-700  uppercase my-2 font-medium">
              {doc.course.category}
            </p>
            <p className="text-black font-semibold text-[1.2rem]">
              {doc.course.title}
            </p>
            <p className="text-gray-800  text-[0.875rem]">
              {doc.course.lessonCount} lessons
            </p>

            <p className="text-gray-800 text-[0.875rem]">
              {Math.round(
                (doc.completedLessons.length / doc.course.lessonCount) * 100,
              )}
              % complete
            </p>

            <Button
              variant="default"
              className="text-blue-500 bg-blue-100 w-full my-2 rounded-sm"
              onClick={() => navigate(`/courses/${doc.course._id}`)}
            >
              {doc.completedLessons.length === 0
                ? "Begin Course"
                : "Resume Course"}
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
