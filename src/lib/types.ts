export interface Course {
  id: string;
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
  lessonCount: number;
}

export interface Lesson {
  _id: string;
  title: string;
  course: string;
  order: number;
  youtubeUrl: string;
  createdAt?: string;
  updatedAt?: string;
}
