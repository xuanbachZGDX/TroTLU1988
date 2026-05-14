import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { path } from "../../../utils/constant";

const PostPackage = ({ payload, setPayload }) => {
  const { currentData } = useSelector((state) => state.user);
  
  const packages = [
    { code: "5", value: "Tin VIP Nổi Bật (5 sao)", price: 10000 },
    { code: "4", value: "Tin VIP 1 (4 sao)", price: 7000 },
    { code: "3", value: "Tin VIP 2 (3 sao)", price: 5000 },
    { code: "2", value: "Tin VIP 3 (2 sao)", price: 3000 },
    { code: "0", value: "Tin thường (0 sao)", price: 1000 },
  ];

  const currentPrice = packages.find(p => p.code === (payload.star || "0"))?.price || 1000;
  const durations = [3, 7, 15, 30];
  const totalAmount = currentPrice * (payload.postingDuration || 3);
  const currentBalance = currentData?.balance || 0;
  const isEnoughBalance = currentBalance >= totalAmount;

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 md:p-10 animate-slide-right">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800">Thanh toán & Đăng tin</h2>
      
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block">Chọn loại tin</label>
            <div className="flex flex-col gap-3">
              {packages.map(item => (
                <label 
                  key={item.code} 
                  className={`flex items-center justify-between p-3 border rounded-md cursor-pointer transition-colors ${payload.star === item.code ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="star" 
                      className="w-4 h-4 accent-blue-600"
                      checked={payload.star === item.code}
                      onChange={() => setPayload(prev => ({ ...prev, star: item.code }))}
                    />
                    <span className="font-medium text-gray-800">{item.value}</span>
                  </div>
                  <span className="text-sm text-gray-600">{item.price.toLocaleString()}đ / ngày</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block">Số ngày đăng</label>
            <div className="flex flex-wrap gap-3">
              {durations.map(days => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setPayload(prev => ({ ...prev, postingDuration: days }))}
                  className={`px-4 py-2 border rounded-md text-sm transition-colors ${(payload.postingDuration || 3) === days ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {days} ngày
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:w-[350px]">
          <div className="bg-gray-50 rounded-md border border-gray-200 p-6 sticky top-20">
            <h3 className="font-semibold text-lg mb-4 border-b pb-2">Hóa đơn thanh toán</h3>
            <div className="flex flex-col gap-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Loại tin:</span>
                <span className="font-medium">{packages.find(p => p.code === (payload.star || "0"))?.value}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-medium">{payload.postingDuration || 3} ngày</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Đơn giá:</span>
                <span className="font-medium">{currentPrice.toLocaleString()}đ / ngày</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-800">Tổng tiền:</span>
                <span className="text-xl font-bold text-red-600">{totalAmount.toLocaleString()} đ</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded border border-gray-200 text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Số dư hiện tại:</span>
                <span className="font-semibold text-green-600">{currentBalance.toLocaleString()} đ</span>
              </div>
              {!isEnoughBalance && (
                <div className="text-red-500 mt-2 pt-2 border-t text-xs">
                  Tài khoản không đủ để thanh toán. Vui lòng <Link to={`/${path.SYSTEM}/${path.DEPOSIT}`} className="text-blue-600 underline font-medium">Nạp thêm tiền</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPackage;
