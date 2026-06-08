"use client";
import { Home, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { ChevronDown, Trophy, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  selectSidebarOpen,
  toggleSidebar,
  closeSidebar,
} from "@/features/ui/uiSlice";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

export default function SideBar() {
  const location = useLocation();
  const isOpen = useSelector(selectSidebarOpen);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <>
      {/* overlay - mobile only, outside the aside */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => dispatch(closeSidebar())}
        />
      )}
      <aside
        className={`
          fixed left-0 top-0 h-full w-55 z-50
          transition-transform duration-300 min-h-screen flex-col overflow-hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:z-auto lg:sticky lg:top-0 lg:h-screen bg-white
         lg:flex border-r border-gray-100 py-4
        `}
      >
        <div className=" border-b border-b-[#292c33] md:hidden">
          <p className="uppercase  text-[#e8ff47] p-3 font-display text-[1.2rem]">
            Football Analytics
          </p>
        </div>
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 p-3 ${location.pathname === "/dashboard" ? "text-[#e8ff47]" : "text-white"}`}
          onClick={() => dispatch(closeSidebar())}
        >
          <Home className="w-5 h-5" />
          <p>Home</p>
        </Link>
        <Link
          to="/dashboard/settings"
          className={`flex items-center gap-3 p-3 ${location.pathname === "/dashboard/settings" ? "text-[#e8ff47] after:opacity-100 font-semibold " : "text-white"}`}
          onClick={() => dispatch(closeSidebar())}
        >
          <Settings className="w-5 h-5" />
          <p>Settings</p>
        </Link>
        <div>
          <button
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
            }}
            className={`flex items-center gap-3 p-3 ${location.pathname === "/dashboard/settings" ? "text-[#e8ff47] after:opacity-100 font-semibold " : "text-white"}`}
          >
            <Trophy className="w-5 h-5" />
            Leagues {dropdownOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
      </aside>
    </>
  );
}
