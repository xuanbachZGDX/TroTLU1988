import React, { useState, useEffect } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import {
  RiHeartLine,
  RiHeartFill,
  RiShareForwardLine,
  RiFlagLine,
  RiShieldCheckFill,
} from "react-icons/ri";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiCreateReport } from "../../../services/postService";
import {
  handleShareLink,
  handleReportPost,
} from "../../../utils/contactHelpers";

const SidebarContact = ({ user, postId, getPhoneLink, getZaloLink }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsSaved(wishlist.includes(postId));
  }, [postId]);

  const handleShare = () => {
    handleShareLink(window.location.href);
  };

  const handleSave = () => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (wishlist.includes(postId)) {
      wishlist = wishlist.filter((id) => id !== postId);
      setIsSaved(false);
      Swal.fire({
        icon: "info",
        title: "Đã bỏ lưu",
        text: "Tin đăng đã được xóa khỏi danh sách yêu thích.",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      wishlist.push(postId);
      setIsSaved(true);
      Swal.fire({
        icon: "success",
        title: "Đã lưu tin!",
        text: "Bạn có thể xem lại trong mục Tin đã lưu.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center text-center gap-4">
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt="Avatar"
          className="w-20 h-20 rounded-full object-cover border border-gray-100"
        />
      ) : (
        <FaRegUserCircle size={80} className="text-gray-300" />
      )}

      <div>
        <p className="font-bold text-base text-gray-800 flex items-center justify-center gap-1">
          {user?.name || "---"}
          {user?.kycStatus === "verified" && (
            <RiShieldCheckFill
              className="text-green-500"
              title="Chủ trọ đã xác minh danh tính"
              size={18}
            />
          )}
        </p>
        <p className="flex items-center justify-center gap-1.5 text-sm text-gray-500 mt-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
          Đang hoạt động
        </p>
      </div>

      <a
        href={getPhoneLink(user?.phone)}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg text-base transition flex items-center justify-center gap-2"
      >
        📞 {user?.phone || "---"}
      </a>

      <a
        href={getZaloLink(user?.zalo, user?.phone)}
        target="_blank"
        rel="noreferrer"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg text-base transition flex items-center justify-center gap-2"
      >
        💬 Nhắn Zalo
      </a>

      <div className="w-full border-t border-gray-100 pt-4 flex items-center justify-around">
        <button
          onClick={handleSave}
          className={`flex flex-col items-center gap-1 transition ${isSaved ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
        >
          {isSaved ? <RiHeartFill size={24} /> : <RiHeartLine size={24} />}
          <span className="text-[11px] font-bold uppercase">
            {isSaved ? "Đã lưu" : "Lưu tin"}
          </span>
        </button>

        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-500 transition"
        >
          <RiShareForwardLine size={24} />
          <span className="text-[11px] font-bold uppercase">Chia sẻ</span>
        </button>

        <button
          onClick={() =>
            handleReportPost(postId, isLoggedIn, navigate, apiCreateReport)
          }
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-orange-500 transition"
        >
          <RiFlagLine size={24} />
          <span className="text-[11px] font-bold uppercase">Báo xấu</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarContact;
