import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";

const DashLayout = () => {
  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-100">
        <SideBar />
        <main className="flex-1 ">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default DashLayout;
