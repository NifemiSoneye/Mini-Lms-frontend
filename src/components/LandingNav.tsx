import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function LandingNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between bg-white border-b border-gray-100">
      {/* Logo */}
      <Link to="/" className="text-blue-600 font-bold text-xl">
        Coursa
      </Link>

      {/* Desktop auth buttons */}
      <div className="flex items-center gap-3">
        <Button variant="outline" asChild>
          <Link to="/login">Login</Link>
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
          <Link to="/register">Sign Up</Link>
        </Button>
      </div>
    </nav>
  );
}
