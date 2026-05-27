import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../components";
import { apiResetPassword, apiForgotPassword } from "../../../services/authService";
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
  const [otpCountdown, setOtpCountdown] = useState(60);

  useEffect(() => {
    if (!location.state?.email) {
      Swal.fire("Lỗi!", "Vui lòng nhập Email trước!", "warning").then(() => {
        navigate("/forgot-password");
      });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await apiForgotPassword(email);
      if (response?.data?.err === 0) {
        setOtpCountdown(60);
        Swal.fire("Thành công", "Mã OTP mới đã được gửi tới email của bạn!", "success");
      } else {
        Swal.fire("Lỗi!", response?.data?.msg || "Không thể gửi lại mã OTP", "error");
      }
    } catch (error) {
      Swal.fire("Lỗi!", "Có lỗi xảy ra khi gửi lại mã.", "error");
    }
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (otpCountdown <= 0) {
      Swal.fire("Lỗi!", "Mã OTP đã hết hiệu lực, vui lòng yêu cầu mã mới!", "error");
      return;
    }
    if (!otp || !password || !confirmPassword) {
      Swal.fire("Thông báo", "Vui lòng nhập đầy đủ thông tin!", "error");
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
        <p className="text-gray-500 text-sm mb-4 text-center">
          Nhập mã OTP (gửi qua Email) và mật khẩu mới cho tài khoản <strong>{email}</strong>.
        </p>

        <div className="flex justify-center mb-6">
          {otpCountdown > 0 ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-sm font-semibold">
              <span className="animate-pulse">⏳</span>
              <span>Mã OTP hết hạn sau: <span className="font-mono text-red-600 font-bold">{otpCountdown}s</span></span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-full text-sm font-semibold">
                <span>🚫 Mã OTP đã hết hạn!</span>
              </div>
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-blue-600 hover:text-blue-800 underline text-xs font-semibold mt-1 transition-colors"
              >
                Gửi lại mã OTP mới
              </button>
            </div>
          )}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); }} className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-700">Mã OTP (6 chữ số)</label>
            <input
              type="text"
              className="outline-none bg-[#f3f4f6] p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 transition-all shadow-sm text-center tracking-[1em] font-bold text-xl"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
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
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
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
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
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
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
