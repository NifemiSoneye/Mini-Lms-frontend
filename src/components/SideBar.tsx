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
import { LayoutDashboard } from "lucide-react";
import useAuth from "@/features/auth/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
export default function SideBar() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const isOpen = useSelector(selectSidebarOpen);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleAdminClick = (e: React.MouseEvent) => {
    if (!isAdmin) {
      e.preventDefault();
      dispatch(closeSidebar());
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
      });
    } else {
      navigate("/admin");
      dispatch(closeSidebar());
    }
  };
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
        <div className="text-blue-700 font-medium border-b border-b-gray-300 text-[1rem] p-3 m-1 md:hidden">
          Coursa
        </div>
        <Link
          to="/home"
          className={`flex items-center gap-3 p-3 rounded-md mx-2 ${
            location.pathname === "/home"
              ? "text-blue-600 bg-blue-50 font-medium"
              : "text-gray-700"
          }`}
          onClick={() => dispatch(closeSidebar())}
        >
          <Home className="w-5 h-5" />
          <p>Home</p>
        </Link>
        <button
          className={`flex items-center gap-3 p-3 rounded-md mx-3 w-[90%] ${
            location.pathname === "/admin"
              ? "text-blue-600 bg-blue-50 font-medium"
              : "text-gray-700"
          }`}
          onClick={handleAdminClick}
        >
          <LayoutDashboard className="w-5 h-5" />
          <p>Admin</p>
        </button>
      </aside>
    </>
  );
}
