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

const Login = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, msg, update, token } = useSelector((state) => state.auth);
  const { currentData } = useSelector((state) => state.user);
  const isAdminLogin = location.pathname.includes('admin');

  const [isRegister, setIsRegister] = useState(location.state?.flag);
  const [invalidFields, setInvalidFields] = useState([]);
  const [payload, setPayload] = useState({ phone: "", password: "", name: "", accountType: "" });

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
        Swal.fire({
          title: "Đăng nhập thành công!",
          text: `Xin chào, ${currentData?.name || (isAdmin ? "Quản trị viên" : "Người dùng")}!`,
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
  }, [isLoggedIn, currentData, navigate, isAdminLogin, token]);

  useEffect(() => {
    msg && Swal.fire("Thông báo", msg, "error");
  }, [msg, update]);

  const handleSubmit = async () => {
    let finalPayload = isRegister ? payload : { phone: payload.phone, password: payload.password };
    let invalids = validate(finalPayload, setInvalidFields);

    // Validate thêm: loại tài khoản bắt buộc khi đăng ký
    if (isRegister && !payload.accountType) {
      setInvalidFields(prev => [
        ...prev.filter(f => f.name !== 'accountType'),
        { name: 'accountType', message: 'Vui lòng chọn loại tài khoản' }
      ]);
      invalids = [...invalids, { name: 'accountType' }];
    }

    if (invalids.length === 0) {
      if (isRegister) {
        const response = await apiRegister(payload);
        if (response?.data?.err === 0) {
          const roleLabel = payload.accountType === 'landlord' ? 'Chủ trọ' : 'Khách hàng';

          Swal.fire({
            title: `Đăng ký thành công!`,
            text: `Đã tạo tài khoản ${roleLabel} thành công. Vui lòng đăng nhập lại để sử dụng.`,
            icon: 'success',
            confirmButtonText: 'Đăng nhập ngay',
          }).then(() => {
            setIsRegister(false);
            setPayload({ phone: payload.phone, password: '', name: '', accountType: '' });
          });
        } else {
          Swal.fire("Thất bại", response?.data?.msg || "Đăng ký thất bại", "error");
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
