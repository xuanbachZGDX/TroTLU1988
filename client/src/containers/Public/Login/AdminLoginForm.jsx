import React from "react";
import { InputForm } from "../../../components";

const AdminLoginForm = ({ payload, setPayload, invalidFields, setInvalidFields, handleSubmit, navigate }) => {
  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-[100]">
      <div className="w-full max-w-md p-10 bg-white rounded-xl shadow-xl border border-gray-200 animate-slide-up">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100">
             <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Quản trị hệ thống</h2>
          <p className="text-gray-500 mt-2 text-sm">Cổng đăng nhập dành riêng cho quản trị viên</p>
        </div>

        <div className="space-y-6">
          <InputForm
            setInvalidFields={setInvalidFields}
            invalidFields={invalidFields}
            label={<span className="text-gray-700 text-xs font-bold uppercase">Số điện thoại Admin</span>}
            value={payload.phone}
            setValue={setPayload}
            keyPayload={"phone"}
          />
          <InputForm
            setInvalidFields={setInvalidFields}
            invalidFields={invalidFields}
            label={<span className="text-gray-700 text-xs font-bold uppercase">Mật khẩu bảo mật</span>}
            value={payload.password}
            setValue={setPayload}
            keyPayload={"password"}
            type="password"
          />
          
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all shadow-md active:scale-[0.98] uppercase tracking-wide"
            >
              Xác thực & Đăng nhập
            </button>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-blue-600 text-sm transition-colors font-medium"
          >
            ← Quay lại trang chủ người dùng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginForm;
