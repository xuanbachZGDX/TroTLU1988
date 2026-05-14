import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { path } from "../../../utils/constant";

const AdminGuard = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { currentData } = useSelector((state) => state.user);

  if (!isLoggedIn) return <Navigate to={`/${path.LOGIN}`} replace />;
  if (!currentData?.id) return <div className="p-4">Đang tải quyền truy cập...</div>;
  if (currentData?.role !== "admin") {
    return <Navigate to={`/he-thong/${path.MANAGE_POST}`} replace />;
  }

  return children;
};

export default AdminGuard;
