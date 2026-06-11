import {
  useGetAdminCoursesQuery,
  useDeleteCourseMutation,
  useTogglePublishMutation,
  useUpdateCourseMutation,
  useCreateCourseMutation,
} from "@/features/courses/courseApiSlice";
import { Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { type Course } from "@/lib/types";
import { CourseModal } from "./CourseModal";
export default function AdminCourses() {
  const { data: adminCourses, isLoading: isAdminCoursesLoading } =
    useGetAdminCoursesQuery(undefined);
  const [deleteCourse] = useDeleteCourseMutation();
  const [togglePublish] = useTogglePublishMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [createCourse, { isLoading: isCreateLoading }] =
    useCreateCourseMutation();
  const { toast } = useToast();
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [courseDescription, setCourseDescription] = useState<string>("");
  const [courseCategory, setCourseCategory] = useState<string>("");
  const [courseThumbnail, setCourseThumbnail] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleCreate = async () => {
    try {
      const response = await createCourse({
        title: courseTitle,
        description: courseDescription,
        category: courseCategory,
        thumbnailUrl: courseThumbnail,
      }).unwrap();
      setCourseTitle("");
      setCourseCategory("");
      setCourseDescription("");
      setCourseThumbnail("");
      setIsOpen(false);
      toast({
        variant: "default",
        title: "Success! 🎉",
        description: response.message,
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.data?.message || "Failed to create course",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse({ id }).unwrap();
      toast({
        title: "Course deleted",
        description: "Course has been deleted successfully",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.data?.message || "Failed to delete course",
      });
    }
  };

  const handleClose = () => {
    setSelectedCourse(null);
    setIsOpen(false);
  };
  if (isAdminCoursesLoading) return <div>Loading...</div>;
  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-4">
        {adminCourses?.map((course: any) => (
          <div
            key={course._id}
            className="bg-white rounded-xl overflow-hidden shadow-xl"
          >
            {/* thumbnail */}
            <div className="h-44 w-full">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </div>
            {/* course info */}
            <div className="p-4">
              <p className="text-blue-600 text-xs font-semibold uppercase">
                {course.category}
              </p>
              <p className="text-black font-semibold text-lg mt-1">
                {course.title}
              </p>
            </div>
            <div className="flex items-center justify-between px-4 pb-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={course.isPublished}
                  onCheckedChange={() => togglePublish({ id: course._id })}
                />
                <span className="text-sm text-gray-600">
                  {course.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="bg-blue-50 p-2 rounded-full hover:bg-blue-100 transition-colors"
                  onClick={() => {
                    setSelectedCourse(course);
                    setIsOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  className="bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors"
                  onClick={() => handleDelete(course._id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        className="fixed bottom-4 right-4 bg-blue-800 h-12 w-12 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
        onClick={() => {
          setSelectedCourse(null);
          setIsOpen(true);
        }}
      >
        <PlusCircle className="w-6 h-6 text-white" />
      </div>

      <CourseModal
        isOpen={isOpen}
        onClose={handleClose}
        course={selectedCourse ?? undefined}
      />
    </div>
  );
}
