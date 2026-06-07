import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import * as actions from "../../../store/actions";
import validate from "../../../utils/Common/validate";
import { apiRegister } from "../../../services/authService";
import { path } from "../../../utils/constant";
import AdminLoginForm from "./AdminLoginForm";
import UserAuthForm from "./UserAuthForm";
import { getRoleFromToken, normalizeRole } from "../../../utils/Common/role";
import { normalizePhone } from "../../../utils/Common/phone";
import { useGoogleAuth } from "./useGoogleAuth";

const emptyPayload = { phone: "", password: "", name: "", accountType: "" };

const Login = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, msg, update, token } = useSelector((state) => state.auth);
  const { currentData } = useSelector((state) => state.user);
  const isAdminLogin = location.pathname.includes("admin");

  const [isRegister, setIsRegister] = useState(location.state?.flag);
  const [invalidFields, setInvalidFields] = useState([]);
  const [payload, setPayload] = useState(emptyPayload);

  const {
    googleAccountType,
    setGoogleAccountType,
    googleProfile,
    handleGoogleSuccess,
    handleGoogleAccountTypeSubmit,
    handleGoogleError,
    resetGoogleSelection,
  } = useGoogleAuth();

  useEffect(() => {
    setIsRegister(location.state?.flag);
  }, [location.state?.flag]);

  const hasShownSuccessRef = useRef(false);

  useEffect(() => {
    if (isLoggedIn && currentData?.id) {
      const role = getRoleFromToken(token) || normalizeRole(currentData.role);
      const isAdmin = role === "admin";

      if (!hasShownSuccessRef.current) {
        hasShownSuccessRef.current = true;
        resetGoogleSelection();
        Swal.fire({
          title: "Đăng nhập thành công!",
          text: `Xin chào, ${currentData?.name || (isAdmin ? "Quản trị viên" : "Người dùng")}!`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          allowOutsideClick: false,
          didClose: () => {
            if (isAdmin) {
              navigate(`/${path.ADMIN}/${path.ADMIN_DASHBOARD}`, {
                replace: true,
              });
            } else {
              navigate("/", { replace: true });
            }
          },
        });
      } else {
        if (isAdmin && isAdminLogin) {
          navigate(`/${path.ADMIN}/${path.ADMIN_DASHBOARD}`, { replace: true });
        } else if (!isAdmin && !isAdminLogin) {
          navigate("/", { replace: true });
        }
      }
    }
  }, [isLoggedIn, currentData, navigate, isAdminLogin, token]);

  useEffect(() => {
    if (!msg) return;
    Swal.fire("Thông báo", msg, "error");
  }, [msg, update]);

  const handleSubmit = async () => {
    let rawPhone = payload.phone;
    if (rawPhone) {
      let normalized = normalizePhone(rawPhone);
      payload.phone = normalized;
      setPayload((prev) => ({ ...prev, phone: normalized }));
    }

    let finalPayload = isRegister
      ? payload
      : { phone: payload.phone, password: payload.password };
    let invalids = validate(finalPayload, setInvalidFields);

    if (isRegister && !payload.accountType) {
      setInvalidFields((prev) => [
        ...prev.filter((f) => f.name !== "accountType"),
        { name: "accountType", message: "Vui lòng chọn loại tài khoản" },
      ]);
      invalids = [...invalids, { name: "accountType" }];
    }

    if (invalids.length === 0) {
      if (isRegister) {
        try {
          const response = await apiRegister(payload);
          if (response?.data?.err === 0) {
            const roleLabel =
              payload.accountType === "landlord" ? "Chủ trọ" : "Khách hàng";

            Swal.fire({
              title: "Đăng ký thành công!",
              text: `Đã tạo tài khoản ${roleLabel} thành công. Vui lòng đăng nhập lại để sử dụng.`,
              icon: "success",
              confirmButtonText: "Đăng nhập ngay",
            }).then(() => {
              setIsRegister(false);
              setPayload({ ...emptyPayload, phone: payload.phone });
            });
          } else {
            Swal.fire(
              "Thất bại",
              response?.data?.msg || "Đăng ký thất bại",
              "error",
            );
          }
        } catch (error) {
          console.error("Register Error:", error);
          const errorMsg =
            error?.response?.data?.msg ||
            "Đăng ký thất bại do dữ liệu không hợp lệ!";
          Swal.fire("Thất bại", errorMsg, "error");
        }
      } else {
        dispatch(actions.login(finalPayload));
      }
    }
  };

  if (isAdminLogin) {
    return (
      <AdminLoginForm
        payload={payload}
        setPayload={setPayload}
        invalidFields={invalidFields}
        setInvalidFields={setInvalidFields}
        handleSubmit={handleSubmit}
        navigate={navigate}
      />
    );
  }

  return (
    <UserAuthForm
      isRegister={isRegister}
      setIsRegister={(value) => {
        setIsRegister(value);
        resetGoogleSelection();
      }}
      payload={payload}
      setPayload={setPayload}
      invalidFields={invalidFields}
      setInvalidFields={setInvalidFields}
      handleSubmit={handleSubmit}
      handleGoogleSuccess={handleGoogleSuccess}
      handleGoogleError={handleGoogleError}
      handleGoogleAccountTypeSubmit={handleGoogleAccountTypeSubmit}
      googleAccountType={googleAccountType}
      setGoogleAccountType={setGoogleAccountType}
      googleProfile={googleProfile}
      navigate={navigate}
      path={path}
      resetGoogleSelection={resetGoogleSelection}
      resetFormPayload={() => setPayload(emptyPayload)}
    />
  );
};

export default Login;
