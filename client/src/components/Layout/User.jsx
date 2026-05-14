import React from "react";
import { useSelector } from "react-redux";
import userAvatar from "../../assets/user.png";

const User = () => {
  const { currentData } = useSelector((state) => state.user);

  return (
    <div className="flex items-center gap-2">
      <img
        src={typeof currentData?.avatar === 'string' && currentData?.avatar ? currentData.avatar : userAvatar}
        alt="avatar"
        className="w-10 h-10 object-cover rounded-full border-2 border-white shadow-md"
      />
      <div className="flex flex-col">
        <span>
          Xin chào, <span className="font-semibold">{currentData?.name}</span>
        </span>
        <span className="text-sm">
          Mã: <span className="font-bold">{currentData?.id?.slice(0, 8).toUpperCase()}</span>
        </span>
      </div>
    </div>
  );
};

export default User;
