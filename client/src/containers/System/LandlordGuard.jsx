import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { path } from "../../utils/constant";
import Swal from "sweetalert2";
import { normalizeRole } from "../../utils/Common/role";

// JWT dùng base64URL (có ký tự - và _), phải convert trước khi dùng atob()
const decodeJwtRole = (token) => {
  try {
    const base64Url = token.split(".")[1];
    // Đổi base64URL → base64 chuẩn
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return normalizeRole(payload?.role);
  } catch {
    return null;
  }
};

const LandlordGuard = ({ children }) => {
  const { isLoggedIn, token } = useSelector((state) => state.auth);

  // Lấy role từ token (useMemo để không decode lại mỗi lần render)
  const role = React.useMemo(() => decodeJwtRole(token), [token]);
  const isAllowed = isLoggedIn && (role === "landlord" || role === "admin");

  // Swal phải dùng useEffect, không được gọi trực tiếp trong render
  React.useEffect(() => {
    if (isLoggedIn && token && !isAllowed) {
      Swal.fire({
        icon: "warning",
        title: "Không có quyền truy cập",
        text: "Chức năng này chỉ dành cho tài khoản Chủ trọ.",
        confirmButtonText: "Đã hiểu",
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isLoggedIn || !token) return <Navigate to={`/${path.LOGIN}`} replace />;
  if (!isAllowed) return <Navigate to="/" replace />;

  return children;
};

export default LandlordGuard;
