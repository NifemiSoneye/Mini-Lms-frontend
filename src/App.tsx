import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LoaderCircle } from "lucide-react";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import RequireAdmin from "./features/auth/RequireAdmin";
import { Toaster } from "./components/ui/toaster";
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const CoursePage = lazy(() => import("./pages/CoursePage"));
const CourseDetailsPage = lazy(() => import("./pages/CourseDetailsPage"));
const VideoLessonPage = lazy(() => import("./pages/VideoLessonPage"));
const AdminDashBoard = lazy(() => import("./pages/AdminDashBoard"));
const Landing = lazy(() => import("./pages/Landing"));

function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="fixed inset-0 bg-[#0B1628] grid place-content-center">
            <LoaderCircle className="h-16 w-16 animate-spin text-white" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route path="/courses" element={<CoursePage />} />
              <Route path="/courses/:id" element={<CourseDetailsPage />} />
              <Route
                path="/courses/:id/lessons/:lessonId"
                element={<VideoLessonPage />}
              />
              <Route element={<RequireAdmin />}>
                <Route path="/admin" element={<AdminDashBoard />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
