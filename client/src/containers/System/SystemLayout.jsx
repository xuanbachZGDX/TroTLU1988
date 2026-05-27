import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { path } from "../../utils/constant";
import SystemSidebar from "./SystemSidebar";
import { Navigation } from "../Public";
import * as actions from "../../store/actions";

const SystemLayout = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(actions.getCurrent());
    }
  }, [location.pathname, isLoggedIn, dispatch]);

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
