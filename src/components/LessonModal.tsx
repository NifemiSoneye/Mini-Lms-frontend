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
import {
  useAddLessonMutation,
  useUpdateLessonMutation,
} from "@/features/lessons/lessonApiSlice";
type LessonModalProps = {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  lesson?: {
    _id: string;
    title: string;
    order: number;
    youtubeUrl: string;
  };
};

export function LessonModal({
  isOpen,
  onClose,
  courseId,
  lesson,
}: LessonModalProps) {
  const isEditing = !!lesson;
  const [lessonTitle, setLessonTitle] = useState(lesson?.title ?? "");
  const [lessonOrder, setLessonOrder] = useState<number>(lesson?.order ?? 1);
  const [lessonURL, setLessonURL] = useState(lesson?.youtubeUrl ?? "");

  useEffect(() => {
    if (lesson) {
      setLessonTitle(lesson.title);
      setLessonOrder(lesson.order);
      setLessonURL(lesson.youtubeUrl);
    }
  }, [lesson]);

  useEffect(() => {
    if (!isOpen) {
      setLessonTitle("");
      setLessonOrder(1);
      setLessonURL("");
    }
  }, [isOpen]);

  const [addLesson, { isLoading: isAddLessonLoading }] = useAddLessonMutation();
  const [updateLesson, { isLoading: isUpdateLoading }] =
    useUpdateLessonMutation();
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await updateLesson({
          courseId,
          lessonId: lesson._id,
          title: lessonTitle,
          order: lessonOrder,
          youtubeUrl: lessonURL,
        }).unwrap();
      } else {
        await addLesson({
          courseId,
          title: lessonTitle,
          order: lessonOrder,
          youtubeUrl: lessonURL,
        }).unwrap();
      }
      toast({ title: `Lesson ${isEditing ? "updated" : "created"}! 🎉` });
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
            {isEditing ? "Edit Lesson" : "Create Lesson"}
          </h2>
          <button onClick={onClose} className="text-blue-700">
            ✕
          </button>
        </div>
        <Label
          htmlFor="lesson-name"
          className="text-gray-800 text-xs uppercase tracking-wider mb-2 block my-1"
        >
          Lesson Title
        </Label>
        <Input
          className="w-full border border-gray-300 rounded-md p-5 focus:outline-none focus:border-blue-600"
          placeholder="e.g. How to invoke a function"
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
        />
        <Label
          htmlFor="lesson-order"
          className="text-gray-800 text-xs uppercase tracking-wider mb-2 block my-1"
        >
          Lesson Order
        </Label>
        <Input
          type="number"
          placeholder="1"
          className="w-full border border-gray-300 rounded-md p-5 focus:outline-none focus:border-blue-600"
          value={lessonOrder}
          onChange={(e) => setLessonOrder(Number(e.target.value))}
        />
        <Label
          htmlFor="lesson-URL"
          className="text-gray-800 text-xs uppercase tracking-wider mb-2 block my-1"
        >
          Lesson Youtube URL
        </Label>
        <Input
          className="w-full border border-gray-300 rounded-md p-5 focus:outline-none focus:border-blue-600"
          placeholder="e.g. https://youtube.com/yourURL"
          value={lessonURL}
          onChange={(e) => setLessonURL(e.target.value)}
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
            {isAddLessonLoading || isUpdateLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Create Lesson"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
