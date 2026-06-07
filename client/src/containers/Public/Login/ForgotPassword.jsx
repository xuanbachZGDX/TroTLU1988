import React, { useState, useEffect } from "react";
import { Button } from "../../../components";
import { apiForgotPassword } from "../../../services/authService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async () => {
    if (!email) {
      Swal.fire("Lỗi!", "Vui lòng nhập email của bạn!", "error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire("Lỗi!", "Email không đúng định dạng!", "error");
      return;
    }
    if (countdown > 0) {
      Swal.fire(
        "Lỗi!",
        "Vui lòng đợi 60 giây trước khi yêu cầu mã OTP mới",
        "error",
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiForgotPassword(email);
      if (response?.data?.err === 0) {
        setCountdown(60);
        Swal.fire("Thành công", response.data.msg, "success").then(() => {
          navigate("/reset-password", { state: { email } });
        });
      } else {
        if (response?.data?.msg?.includes("Vui lòng đợi")) {
          setCountdown(60);
        }
        Swal.fire("Lỗi!", response.data.msg, "error");
      }
    } catch (error) {
      Swal.fire("Lỗi!", "Có lỗi xảy ra, vui lòng thử lại sau.", "error");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full flex items-center justify-center py-10">
      <div className="bg-white w-[500px] p-[30px] rounded-md shadow-sm border border-gray-200">
        <h3 className="font-semibold text-2xl mb-2 text-center text-blue-600">
          Quên mật khẩu?
        </h3>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Nhập Email của bạn và chúng tôi sẽ gửi mã OTP xác thực qua Email.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="w-full flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-700">
              Email khôi phục
            </label>
            <input
              type="email"
              className="outline-none bg-[#e8f0fe] p-2 rounded-md w-full focus:ring-2 focus:ring-blue-300 transition-all"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
          </div>
          <Button
            text={
              countdown > 0
                ? `Gửi lại sau (${countdown}s)`
                : isLoading
                  ? "Đang gửi mã..."
                  : "Gửi mã OTP"
            }
            bgColor={countdown > 0 ? "bg-gray-400" : "bg-blue-600"}
            textColor="text-white"
            fullWidth
            onClick={countdown > 0 ? null : handleSubmit}
            disabled={isLoading || countdown > 0}
          />
          <div className="text-center mt-4">
            <span
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:underline cursor-pointer text-sm font-medium"
            >
              ← Quay lại đăng nhập
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
