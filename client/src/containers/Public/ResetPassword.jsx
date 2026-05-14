import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components";
import { apiResetPassword } from "../../services/authService";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!location.state?.email) {
      Swal.fire("Lỗi!", "Vui lòng nhập Email trước!", "warning").then(() => {
        navigate("/forgot-password");
      });
    }
  }, [location.state, navigate]);

  const handleSubmit = async () => {
    if (!otp || !password || !confirmPassword) {
      Swal.fire("Oops!", "Vui lòng nhập đầy đủ thông tin!", "error");
      return;
    }
    if (password.length < 6) {
      Swal.fire("Lỗi!", "Mật khẩu phải có ít nhất 6 ký tự!", "error");
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire("Lỗi!", "Mật khẩu xác nhận không khớp!", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiResetPassword({ password, otp, email });
      if (response?.data?.err === 0) {
        Swal.fire("Thành công", response.data.msg, "success").then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire("Lỗi!", response.data.msg, "error");
      }
    } catch (error) {
      Swal.fire("Lỗi!", "Mã OTP không chính xác hoặc đã hết hạn.", "error");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full flex items-center justify-center py-10">
      <div className="bg-white w-[500px] p-[30px] rounded-md shadow-lg border border-gray-100">
        <h3 className="font-bold text-2xl mb-2 text-center text-blue-600">Xác thực & Đặt lại mật khẩu</h3>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Nhập mã OTP (gửi qua Email) và mật khẩu mới cho tài khoản <strong>{email}</strong>.
        </p>
        <div className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-700">Mã OTP (6 chữ số)</label>
            <input
              type="text"
              className="outline-none bg-[#f3f4f6] p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 transition-all shadow-sm text-center tracking-[1em] font-bold text-xl"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="text-xs font-bold uppercase text-gray-700">Mật khẩu mới</label>
            <input
              type={showPassword ? "text" : "password"}
              className="outline-none bg-[#f3f4f6] p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span 
              className="absolute right-3 top-8 cursor-pointer text-gray-500 hover:text-blue-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-700">Xác nhận mật khẩu</label>
            <input
              type={showPassword ? "text" : "password"}
              className="outline-none bg-[#f3f4f6] p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button
              text={isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
              bgColor="bg-blue-600"
              textColor="text-white"
              fullWidth
              onClick={handleSubmit}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
