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
            <InputForm
              setInvalidFields={setInvalidFields}
              invalidFields={invalidFields}
              label={"HỌ TÊN"}
              value={payload.name}
              setValue={setPayload}
              keyPayload={"name"}
            />
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
                  setPayload({ phone: "", password: "", name: "" });
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
                  setPayload({ phone: "", password: "", name: "" });
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
