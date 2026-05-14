import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { path } from "../../utils/constant";
import SystemSidebar from "./SystemSidebar";
import { Navigation } from "../Public";

const SystemLayout = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  if (!isLoggedIn) return <Navigate to={`/${path.LOGIN}`} replace={true} />;

  return (
    <div className="w-full h-screen flex flex-col items-center bg-slate-50">
      <div className="w-full flex-none">
        <Navigation showLogo={true} />
      </div>
      <div className="flex w-full flex-auto overflow-hidden">
        <SystemSidebar />
        <div className="flex-auto h-full overflow-y-scroll scroll-smooth scroll-pt-32 bg-gray-50 flex flex-col items-center">
          <div className="w-full max-w-[1300px] px-4 md:px-6 pb-12 pt-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLayout;
