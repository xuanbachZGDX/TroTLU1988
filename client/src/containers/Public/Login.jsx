import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import * as actions from "../../store/actions";
import validate from "../../utils/Common/validate";
import { apiRegister } from "../../services/authService";
import { path } from "../../utils/constant";
import AdminLoginForm from "./Login/AdminLoginForm";
import UserAuthForm from "./Login/UserAuthForm";

const Login = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, msg, update } = useSelector((state) => state.auth);
  const { currentData } = useSelector((state) => state.user);
  const isAdminLogin = location.pathname.includes('admin');

  const [isRegister, setIsRegister] = useState(location.state?.flag);
  const [invalidFields, setInvalidFields] = useState([]);
  const [payload, setPayload] = useState({ phone: "", password: "", name: "" });

  useEffect(() => {
    setIsRegister(location.state?.flag);
  }, [location.state?.flag]);

  const hasShownSuccessRef = useRef(false);

  useEffect(() => {
    if (isLoggedIn && currentData?.id) {
      const role = currentData.role?.toLowerCase();
      const isAdmin = role === "admin";
      
      if (!hasShownSuccessRef.current) {
        hasShownSuccessRef.current = true;
        Swal.fire({
          title: "Đăng nhập thành công!",
          text: `Xin chào, ${currentData?.name || (isAdmin ? "Quản trị viên" : "người dùng")}!`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          allowOutsideClick: false,
          didClose: () => {
            if (isAdmin) {
              navigate(`/${path.ADMIN}/${path.ADMIN_DASHBOARD}`, { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          }
        });
      } else {
        if (isAdmin && isAdminLogin) {
          navigate(`/${path.ADMIN}/${path.ADMIN_DASHBOARD}`, { replace: true });
        } else if (!isAdmin && !isAdminLogin) {
          navigate("/", { replace: true });
        }
      }
    }
  }, [isLoggedIn, currentData, navigate, isAdminLogin]);

  useEffect(() => {
    msg && Swal.fire("Oops!", msg, "error");
  }, [msg, update]);

  const handleSubmit = async () => {
    let finalPayload = isRegister ? payload : { phone: payload.phone, password: payload.password };
    let invalids = validate(finalPayload, setInvalidFields);
    if (invalids.length === 0) {
      if (isRegister) {
        const response = await apiRegister(payload);
        if (response?.data?.err === 0) {
          Swal.fire("Thành công", response.data.msg || "Đăng ký thành công!", "success").then(() => {
            setIsRegister(false);
            setPayload({ phone: "", password: "", name: "" });
          });
        } else {
          Swal.fire("Oops!", response?.data?.msg || "Đăng ký thất bại", "error");
        }
      } else {
        dispatch(actions.login(finalPayload));
      }
    }
  };

  const handleGoogleSuccess = (response) => dispatch(actions.loginGoogle(response.credential));
  const handleGoogleError = () => Swal.fire("Lỗi!", "Đăng nhập Google thất bại.", "error");

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
      setIsRegister={setIsRegister}
      payload={payload}
      setPayload={setPayload}
      invalidFields={invalidFields}
      setInvalidFields={setInvalidFields}
      handleSubmit={handleSubmit}
      handleGoogleSuccess={handleGoogleSuccess}
      handleGoogleError={handleGoogleError}
      navigate={navigate}
      path={path}
    />
  );
};

export default Login;
