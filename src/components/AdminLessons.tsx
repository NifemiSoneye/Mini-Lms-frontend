import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useGetAdminCoursesQuery } from "@/features/courses/courseApiSlice";
import { useGetCourseByIdQuery } from "@/features/courses/courseApiSlice";
import { GraduationCap } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import {
  useDeleteLessonMutation,
  useAddLessonMutation,
} from "@/features/lessons/lessonApiSlice";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
export default function AdminLessons() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const { data: adminCourses, isLoading: isAdminCoursesLoading } =
    useGetAdminCoursesQuery(undefined);
  const { data: courseData, isLoading: isLessonsLoading } =
    useGetCourseByIdQuery(selectedCourseId, {
      skip: !selectedCourseId,
    });

  const lessons = courseData?.lessons ?? [];
  const [deleteLesson] = useDeleteLessonMutation();
  const handleDelete = async (id: string) => {
    try {
      await deleteLesson({ id }).unwrap();
      toast({
        title: "Lesson deleted",
        description: "Lesson has been deleted successfully",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.data?.message || "Failed to delete Lesson",
      });
    }
  };
  return (
    <div className="mt-4">
      <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
        Current Course
      </p>
      <Select onValueChange={(value) => setSelectedCourseId(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a course" />
        </SelectTrigger>
        <SelectContent>
          {adminCourses?.map((course: any) => (
            <SelectItem key={course._id} value={course._id}>
              {course.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedCourseId && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-black font-bold text-2xl">Curriculum</h2>
            <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
              {lessons.length} Lessons
            </span>
          </div>
          {isLessonsLoading ? (
            <div>Loading...</div>
          ) : lessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-10 gap-3">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No lessons yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {lessons.map((lesson: any) => (
                <div
                  key={lesson._id}
                  className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm"
                >
                  {/* order number circle */}
                  <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-sm">
                      {String(lesson.order).padStart(2, "0")}
                    </span>
                  </div>
                  {/* lesson info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-black font-medium truncate">
                      {lesson.title}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">YouTube</p>
                  </div>
                  {/* action buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="text-blue-500 hover:text-blue-700 p-1">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 p-1"
                      onClick={() => setLessonToDelete(lesson._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <AlertDialog
        open={!!lessonToDelete}
        onOpenChange={() => setLessonToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the lesson. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (lessonToDelete) handleDelete(lessonToDelete);
                setLessonToDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
