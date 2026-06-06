import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LoaderCircle } from "lucide-react";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
const Login = lazy(() => import("./pages/Login"));
function App() {
  return <></>;
}

export default App;
