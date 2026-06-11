import { useEffect, useState } from "react";
import {
  useUpdateCourseMutation,
  useCreateCourseMutation,
} from "@/features/courses/courseApiSlice";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
type CourseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  course?: {
    _id: string;
    title: string;
    description: string;
    category: string;
    thumbnailUrl: string;
  };
};

export function CourseModal({ isOpen, onClose, course }: CourseModalProps) {
  const isEditing = !!course;
  const [courseTitle, setCourseTitle] = useState(course?.title ?? "");
  const [courseDescription, setCourseDescription] = useState(
    course?.description ?? "",
  );
  const [courseCategory, setCourseCategory] = useState(course?.category ?? "");
  const [courseThumbnail, setCourseThumbnail] = useState(
    course?.thumbnailUrl ?? "",
  );

  useEffect(() => {
    if (course) {
      setCourseTitle(course.title);
      setCourseDescription(course.description);
      setCourseCategory(course.category);
      setCourseThumbnail(course.thumbnailUrl);
    }
  }, [course]);

  useEffect(() => {
    if (!isOpen) {
      setCourseTitle("");
      setCourseDescription("");
      setCourseCategory("");
      setCourseThumbnail("");
    }
  }, [isOpen]);

  const [createCourse, { isLoading: isCreateLoading }] =
    useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdateLoading }] =
    useUpdateCourseMutation();
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await updateCourse({
          id: course._id,
          title: courseTitle,
          description: courseDescription,
          category: courseCategory,
          thumbnailUrl: courseThumbnail,
        }).unwrap();
      } else {
        await createCourse({
          title: courseTitle,
          description: courseDescription,
          category: courseCategory,
          thumbnailUrl: courseThumbnail,
        }).unwrap();
      }
      toast({ title: `Course ${isEditing ? "updated" : "created"}! 🎉` });
      onClose();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.data?.message,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed z-50 bottom-0 left-0 right-0 rounded-t-2xl md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:w-[420px] bg-white p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-black font-semibold text-lg">
            {isEditing ? "Edit Course" : "Create Course"}
          </h2>
          <button onClick={onClose} className="text-blue-700">
            ✕
          </button>
        </div>
        <Label
          htmlFor="course-name"
          className="text-gray-800 text-xs uppercase tracking-wider mb-2 block my-1"
        >
          Course Name
        </Label>
        <Input
          className="w-full border border-gray-300 rounded-md p-5 focus:outline-none focus:border-blue-600"
          placeholder="e.g. How to be a better developer"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
        />
        <Label
          htmlFor="course-name"
          className="text-gray-800 text-xs uppercase tracking-wider mb-2 block my-1"
        >
          Course Description
        </Label>
        <Textarea
          className="w-full mt-3 rounded-sm border border-gray-300 p-2 text-sm focus:outline-none focus:border-blue-600"
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
        />
        <Label
          htmlFor="course-name"
          className="text-gray-800 text-xs uppercase tracking-wider mb-2 block my-1"
        >
          Course Category
        </Label>
        <Input
          className="w-full border border-gray-300 rounded-md p-5 focus:outline-none focus:border-blue-600"
          placeholder="Fashion"
          value={courseCategory}
          onChange={(e) => setCourseCategory(e.target.value)}
        />
        <Label
          htmlFor="course-name"
          className="text-gray-800 text-xs uppercase tracking-wider mb-2 block my-1"
        >
          Course Thumbnail URL
        </Label>
        <Input
          className="w-full border border-gray-300 rounded-md p-5 focus:outline-none focus:border-blue-600"
          placeholder="https://unsplash.com/yourthumbnail"
          value={courseThumbnail}
          onChange={(e) => setCourseThumbnail(e.target.value)}
        />
        <div className="flex gap-3 mt-5">
          <Button
            variant="default"
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-600 rounded-md"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            className="flex-1 bg-blue-800 text-white rounded-md"
          >
            {isCreateLoading || isUpdateLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Create Course"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
