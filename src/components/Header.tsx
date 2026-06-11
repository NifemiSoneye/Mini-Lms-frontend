import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "@/features/ui/uiSlice";
import { useParams } from "react-router-dom";
import { useSendLogoutMutation } from "@/features/auth/authApiSlice";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { Loader } from "lucide-react";
const Header = () => {
  // dispatch actions
  const dispatch = useDispatch();
  const [sendLogout, { isLoading }] = useSendLogoutMutation();

  const flipSideBar = () => {
    dispatch(toggleSidebar());
  };

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await sendLogout(undefined).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const menuIcon = new URL("../assets/icon-hamburger.svg", import.meta.url)
    .href;
  return (
    <div className="bg-white flex justify-between py-2 lg:py-1 lg:px-5 px-3 border-b shadow-sm sticky top-0 z-50">
      <div className="flex items-center">
        <Button
          type="button"
          variant="default"
          title="Sidebar"
          className="bg-transparent lg:hidden"
          onClick={flipSideBar}
        >
          <img
            src={menuIcon}
            alt="hamburger icon"
            className="cursor-pointer h-4 w-5 text-blue-500"
          />
        </Button>

        <p className="text-blue-600 text-[1.5rem] font-semibold">Coursa</p>
      </div>
      <div className="flex items-center mr-6">
        {/* <div className={`hidden lg:block ${id ? "lg:hidden" : null}`}>
          <SearchBar />
        </div> */}

        <Button
          type="button"
          className="bg-blue-500 text-white lg:m-3 lg:p-5 rounded-sm transition-all duration-300 px-5"
          onClick={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          ) : (
            <FontAwesomeIcon icon={faRightFromBracket} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Header;
