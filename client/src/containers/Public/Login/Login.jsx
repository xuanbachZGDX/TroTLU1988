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
  const [googleCredential, setGoogleCredential] = useState("");
  const [googleAccountType, setGoogleAccountType] = useState("");
  const [googleProfile, setGoogleProfile] = useState(null);

  useEffect(() => {
    setIsRegister(location.state?.flag);
  }, [location.state?.flag]);

  const hasShownSuccessRef = useRef(false);

  const resetGoogleSelection = () => {
    setGoogleCredential("");
    setGoogleAccountType("");
    setGoogleProfile(null);
  };

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
      let normalized = rawPhone.replace(/[\s\-\(\)]/g, "");
      if (normalized.startsWith("+84")) {
        normalized = "0" + normalized.slice(3);
      } else if (normalized.startsWith("84") && normalized.length > 9) {
        normalized = "0" + normalized.slice(2);
      }
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

  const handleGoogleSuccess = async (response) => {
    const result = await dispatch(actions.loginGoogle(response.credential));
    if (!result) return;

    if (result.requiresAccountType) {
      setGoogleCredential(response.credential);
      setGoogleAccountType("");
      setGoogleProfile(result.profile || null);
      Swal.fire({
        title: "Hoàn tất tài khoản",
        text: "Email Google này chưa có tài khoản. Hãy chọn vai trò để tiếp tục.",
        icon: "info",
        timer: 1800,
        showConfirmButton: false,
      });
    }
  };

  const handleGoogleAccountTypeSubmit = async () => {
    if (!googleCredential) {
      Swal.fire(
        "Thông báo",
        "Không tìm thấy phiên đăng nhập Google. Vui lòng thử lại.",
        "warning",
      );
      return;
    }

    if (!googleAccountType) {
      Swal.fire(
        "Thông báo",
        "Vui lòng chọn loại tài khoản trước khi tiếp tục.",
        "warning",
      );
      return;
    }

    const result = await dispatch(
      actions.loginGoogle(googleCredential, googleAccountType),
    );
    if (result?.err === 0 && result?.token) {
      resetGoogleSelection();
    }
  };

  const handleGoogleError = () =>
    Swal.fire("Lỗi!", "Đăng nhập Google thất bại.", "error");

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
