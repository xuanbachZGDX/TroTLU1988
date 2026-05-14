import React from "react";
import { Loading } from "../../../../components";
import anonAvatar from "../../../../assets/user.png";

const AccountAvatar = ({ isLoading, avatar, handleUploadFile }) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="flex flex-col items-center gap-4">
        {isLoading ? (
          <div className="w-28 h-28 flex items-center justify-center rounded-full border-2 border-gray-200 shadow-md bg-gray-50">
            <Loading />
          </div>
        ) : (
          <img
            src={typeof avatar === 'string' && avatar ? avatar : anonAvatar}
            alt="avatar"
            className="w-28 h-28 object-cover rounded-full border-2 border-gray-200 shadow-md"
          />
        )}
        <label className="cursor-pointer bg-blue-100 text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-200 transition-colors">
          Đổi ảnh đại diện
          <input type="file" className="hidden" onChange={handleUploadFile} disabled={isLoading} />
        </label>
      </div>
    </div>
  );
};

export default AccountAvatar;
