import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiVnpayReturn } from "../../../services";
import icons from "../../../utils/icons";

const { BsCheckCircleFill, BsXCircleFill } = icons;

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!location.search) {
        setLoading(false);
        return;
      }
      try {
        const response = await apiVnpayReturn(location.search);
        setResult(response.data);
      } catch (error) {
        console.error(error);
        setResult({ code: "99", msg: "Lỗi không xác định" });
      }
      setLoading(false);
    };

    verifyPayment();
  }, [location.search]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Đang xử lý kết quả thanh toán...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg text-center">
        {result?.code === "00" ? (
          <div>
            <BsCheckCircleFill className="mx-auto h-20 w-20 text-green-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Giao dịch thành công
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Bạn đã nạp tiền thành công vào tài khoản TroTLU1988.com. Số dư của
              bạn đã được cập nhật.
            </p>
          </div>
        ) : (
          <div>
            <BsXCircleFill className="mx-auto h-20 w-20 text-red-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Giao dịch thất bại
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {result?.msg || "Giao dịch không thành công hoặc đã bị hủy."}
            </p>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <button
            onClick={() => navigate("/he-thong/quan-ly-bai-dang")}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Quản lý tin đăng
          </button>
          <button
            onClick={() => navigate("/he-thong/tao-moi-bai-dang")}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Tiếp tục đăng tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
