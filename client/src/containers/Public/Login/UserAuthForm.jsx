import React from "react";
import { InputForm, Button } from "../../../components";
import { GoogleLogin } from "@react-oauth/google";

const UserAuthForm = ({ 
  isRegister, 
  setIsRegister, 
  payload, 
  setPayload, 
  invalidFields, 
  setInvalidFields, 
  handleSubmit, 
  handleGoogleSuccess, 
  handleGoogleError, 
  navigate, 
  path 
}) => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="bg-white w-[600px] p-[30px] pb-[100px] rounded-md shadow-sm">
        <h3 className="font-semibold text-2xl mb-3">
          {isRegister ? "Đăng ký tài khoản" : "Đăng nhập"}
        </h3>
        <div className="w-full flex flex-col gap-5">
          {isRegister && (
            <>
              {/* Chọn loại tài khoản */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  LOẠI TÀI KHOẢN BẮT BUỘC
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPayload(prev => ({ ...prev, accountType: 'user' }))}
                    className={`flex-1 flex flex-col items-center justify-center border-2 rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] ${
                      payload.accountType === 'user'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-bold text-base">Người tìm kiếm</span>
                    <span className="text-xs mt-1 text-gray-500">(Người thuê phòng)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayload(prev => ({ ...prev, accountType: 'landlord' }))}
                    className={`flex-1 flex flex-col items-center justify-center border-2 rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] ${
                      payload.accountType === 'landlord'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-bold text-base">Chủ trọ</span>
                    <span className="text-xs mt-1 text-gray-500">(Đăng tin cho thuê)</span>
                  </button>
                </div>
                {/* Hiển thị lỗi nếu chưa chọn loại tài khoản */}
                {invalidFields?.find(f => f.name === 'accountType') && (
                  <small className="text-red-500 font-medium">
                    {invalidFields.find(f => f.name === 'accountType').message}
                  </small>
                )}
              </div>

              <InputForm
                setInvalidFields={setInvalidFields}
                invalidFields={invalidFields}
                label={"HỌ TÊN"}
                value={payload.name}
                setValue={setPayload}
                keyPayload={"name"}
              />
            </>
          )}
          <InputForm
            setInvalidFields={setInvalidFields}
            invalidFields={invalidFields}
            label={"SỐ ĐIỆN THOẠI"}
            value={payload.phone}
            setValue={setPayload}
            keyPayload={"phone"}
          />
          <InputForm
            setInvalidFields={setInvalidFields}
            invalidFields={invalidFields}
            label={"MẬT KHẨU"}
            value={payload.password}
            setValue={setPayload}
            keyPayload={"password"}
            type="password"
          />
          <Button
            text={isRegister ? "Đăng ký" : "Đăng nhập"}
            bgColor="bg-secondary1"
            textColor="text-white"
            fullWidth
            onClick={handleSubmit}
          />
          
          <div className="flex flex-col items-center gap-3 mt-2">
            <div className="flex items-center w-full gap-2">
              <div className="flex-1 h-[1px] bg-gray-300"></div>
              <span className="text-gray-500 text-xs uppercase">Hoặc</span>
              <div className="flex-1 h-[1px] bg-gray-300"></div>
            </div>
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text={isRegister ? "signup_with" : "signin_with"}
                width="100%"
              />
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between">
          {isRegister ? (
            <small>
              Bạn đã có tài khoản?{" "}
              <span
                onClick={() => {
                  setIsRegister(false);
                  setPayload({ phone: "", password: "", name: "", accountType: "" });
                }}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Đăng nhập ngay
              </span>
            </small>
          ) : (
            <>
              <small 
                className="text-[blue] hover:text-[red] cursor-pointer"
                onClick={() => navigate(`/${path.FORGOT_PASSWORD}`)}
              >
                Bạn quên mật khẩu?
              </small>
              <small
                onClick={() => {
                  setIsRegister(true);
                  setPayload({ phone: "", password: "", name: "", accountType: "" });
                }}
                className="text-[blue] hover:text-[red] cursor-pointer"
              >
                Tạo tài khoản mới
              </small>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAuthForm;
