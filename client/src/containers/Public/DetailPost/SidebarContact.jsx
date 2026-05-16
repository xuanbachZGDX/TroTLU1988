import React, { useState, useEffect } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { BsBookmarkStarFill } from "react-icons/bs";
import { RiHeartLine, RiHeartFill, RiShareForwardLine, RiFlagLine } from "react-icons/ri";
import Swal from "sweetalert2";

const SidebarContact = ({ user, postId, getPhoneLink, getZaloLink, formatJoinDate }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsSaved(wishlist.includes(postId));
  }, [postId]);

  const handleShare = () => {
    const currentUrl = window.location.href;
    Swal.fire({
      title: "Chia sẻ tin đăng",
      text: "Đường dẫn tin đăng của bạn:",
      input: "text",
      inputValue: currentUrl,
      inputAttributes: {
        readonly: true
      },
      showCancelButton: true,
      confirmButtonText: "Sao chép Link",
      cancelButtonText: "Đóng",
      footer: '<span style="color: #666; font-size: 12px;">Bạn có thể copy link này để gửi cho bạn bè</span>',
      preConfirm: () => {
        navigator.clipboard.writeText(currentUrl);
        
        // Tạo một thông báo nhỏ (Toast) thủ công để không làm đóng Popup
        const toast = document.createElement("div");
        toast.innerText = "Đã sao chép link!";
        toast.style.cssText = `
          position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
          background: #333; color: #fff; padding: 10px 20px; border-radius: 20px;
          z-index: 9999; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: opacity 0.5s;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.style.opacity = "0";
          setTimeout(() => document.body.removeChild(toast), 500);
        }, 1500);

        return false; // Giữ popup mở
      }
    });
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
        <p className="font-bold text-base text-gray-800">{user?.name || "---"}</p>
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
          <span className="text-[11px] font-bold uppercase">{isSaved ? "Đã lưu" : "Lưu tin"}</span>
        </button>

        <button 
          onClick={handleShare}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-500 transition"
        >
          <RiShareForwardLine size={24} />
          <span className="text-[11px] font-bold uppercase">Chia sẻ</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-orange-500 transition">
          <RiFlagLine size={24} />
          <span className="text-[11px] font-bold uppercase">Báo xấu</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarContact;
