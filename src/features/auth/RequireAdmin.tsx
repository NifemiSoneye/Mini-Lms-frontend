import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuth from "./useAuth";
const RequireAdmin = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const content = isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );

  return content;
};
export default RequireAdmin;
