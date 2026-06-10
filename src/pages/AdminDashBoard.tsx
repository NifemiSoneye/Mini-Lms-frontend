import { useGetStatsQuery } from "@/features/courses/courseApiSlice";
import { useState } from "react";
import AdminOverview from "@/components/AdminOverview";
import { useSearchParams } from "react-router-dom";

type Tab = "Overview" | "Courses" | "Lessons";

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "My Courses";
  const { data: stats, isLoading: isStatsLoading } =
    useGetStatsQuery(undefined);

  const setTab = (tab: Tab) => {
    setSearchParams({ tab }, { replace: true });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
      <div className="flex border-b border-gray-200 gap-4 mt-4">
        {(["Overview", "Courses", "Lessons"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setTab(tab)}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {activeTab === "Overview" && <AdminOverview />}
    </div>
  );
}
