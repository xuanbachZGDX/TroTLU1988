import React, { useState } from "react";
import { Button } from "../../../components";
import { apiForgotPassword } from "../../../services/authService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) {
      Swal.fire("Lỗi!", "Vui lòng nhập email của bạn!", "error");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await apiForgotPassword(email);
      if (response?.data?.err === 0) {
        Swal.fire("Thành công", response.data.msg, "success").then(() => {
          navigate("/reset-password", { state: { email } });
        });
      } else {
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
        <h3 className="font-semibold text-2xl mb-2 text-center text-blue-600">Quên mật khẩu?</h3>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Nhập Email của bạn và chúng tôi sẽ gửi mã OTP xác thực qua Email.
        </p>
        <div className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-700">Email khôi phục</label>
            <input
              type="email"
              className="outline-none bg-[#e8f0fe] p-2 rounded-md w-full focus:ring-2 focus:ring-blue-300 transition-all"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            text={isLoading ? "Đang gửi mã..." : "Gửi mã OTP"}
            bgColor="bg-blue-600"
            textColor="text-white"
            fullWidth
            onClick={handleSubmit}
            disabled={isLoading}
          />
          <div className="text-center mt-4">
            <span
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:underline cursor-pointer text-sm font-medium"
            >
              ← Quay lại đăng nhập
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
