import { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import * as actions from "../../../store/actions";

export const useGoogleAuth = () => {
  const dispatch = useDispatch();
  const [googleCredential, setGoogleCredential] = useState("");
  const [googleAccountType, setGoogleAccountType] = useState("");
  const [googleProfile, setGoogleProfile] = useState(null);

  const resetGoogleSelection = () => {
    setGoogleCredential("");
    setGoogleAccountType("");
    setGoogleProfile(null);
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

  return {
    googleCredential,
    googleAccountType,
    setGoogleAccountType,
    googleProfile,
    handleGoogleSuccess,
    handleGoogleAccountTypeSubmit,
    handleGoogleError,
    resetGoogleSelection,
  };
};
