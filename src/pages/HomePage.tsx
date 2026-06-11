import React from "react";
import Header from "@/components/Header";
import useAuth from "@/features/auth/useAuth";
import CoursePage from "./CoursePage";
export default function HomePage() {
  const { name } = useAuth();
  return (
    <div className="min-h-screen flex-col  px-4 overflow-x-hidden">
      <div className="my-4">
        <h1 className="text-2xl font-bold text-black my-1">
          Welcome back , {name}
        </h1>
        <CoursePage />
      </div>
    </div>
  );
}
