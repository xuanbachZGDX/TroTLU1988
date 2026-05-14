import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { BsBookmarkStarFill } from "react-icons/bs";

const SidebarContact = ({ user, getPhoneLink, getZaloLink, formatJoinDate }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col items-center text-center gap-3">
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt="Avatar"
          className="w-20 h-20 rounded-full object-cover border border-gray-200"
        />
      ) : (
        <FaRegUserCircle size={72} className="text-gray-300" />
      )}

      <div>
        <p className="font-semibold text-base">{user?.name || "---"}</p>
        <p className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
          Đang hoạt động
        </p>
        {user?.createdAt && (
          <p className="text-xs text-gray-400 mt-1">
            Tham gia từ: {formatJoinDate(user.createdAt)}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
        <BsBookmarkStarFill />
        <span>Đối tác</span>
      </div>

      <a
        href={getPhoneLink(user?.phone)}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-green-100"
      >
        📞 {user?.phone || "---"}
      </a>

      <a
        href={getZaloLink(user?.zalo, user?.phone)}
        target="_blank"
        rel="noreferrer"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-full text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
      >
        💬 Nhắn Zalo
      </a>

      <div className="flex items-center justify-around w-full border-t pt-3 text-gray-500 text-xs">
        <button className="flex items-center gap-1 hover:text-red-500 transition text-[11px] font-bold">Lưu tin</button>
        <button className="flex items-center gap-1 hover:text-blue-500 transition text-[11px] font-bold">Chia sẻ</button>
        <button className="flex items-center gap-1 hover:text-orange-500 transition text-[11px] font-bold">Báo xấu</button>
      </div>
    </div>
  );
};

export default SidebarContact;
