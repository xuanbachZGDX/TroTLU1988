import React from "react";
import AccountTypePicker from "./AccountTypePicker";
import { Button } from "../../../components";

const GoogleProfileCompletion = ({
  googleProfile,
  googleAccountType,
  setGoogleAccountType,
  handleGoogleAccountTypeSubmit,
  resetGoogleSelection,
}) => {
  if (!googleProfile) return null;

  return (
    <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {googleProfile.picture ? (
          <img
            src={googleProfile.picture}
            alt="google avatar"
            className="w-12 h-12 rounded-full object-cover border border-blue-100"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            {(googleProfile.name || "G").slice(0, 1).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-800">
            Hoàn tất tài khoản Google
          </p>
          <p className="text-sm text-gray-500">{googleProfile.email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          CHỌN LOẠI TÀI KHOẢN
        </label>
        <AccountTypePicker
          value={googleAccountType}
          onChange={setGoogleAccountType}
        />
      </div>

      <div className="flex gap-3">
        <Button
          text="Hoàn tất đăng nhập Google"
          bgColor="bg-blue-600"
          textColor="text-white"
          fullWidth
          onClick={handleGoogleAccountTypeSubmit}
        />
        <Button
          text="Hủy"
          bgColor="bg-gray-200"
          textColor="text-gray-700"
          fullWidth
          onClick={resetGoogleSelection}
        />
      </div>
    </div>
  );
};

export default GoogleProfileCompletion;
