import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  UserInfo: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

const useAuth = () => {
  const token = useSelector(selectCurrentToken);

  if (token) {
    const decoded = jwtDecode<DecodedToken>(token);
    const { id, email, name, role } = decoded.UserInfo;
    const isAdmin = role === "admin";

    return { id, email, name, role, isAdmin };
  }

  return { id: "", email: "", name: "", role: "", isAdmin: false };
};

export default useAuth;
