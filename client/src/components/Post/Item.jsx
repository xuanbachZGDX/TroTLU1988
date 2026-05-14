import React, { memo, useState } from "react";
import icons from "../../utils/icons";
import { Link } from "react-router-dom";
import { formatVietnameseToString } from "../../utils/Common/formatVietnameseToString";
import { path } from "../../utils/constant";
import anonAvatar from "../../assets/user.png";
import Swal from "sweetalert2";

const { GrStar, RiHeartFill, RiHeartLine, HiOutlineLocationMarker } = icons;

const Item = ({
  images,
  user,
  title,
  star,
  description,
  attributes,
  address,
  id,
  expired
}) => {
  const [isHoverHeart, setIsHoverHeart] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  React.useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsSaved(wishlist.includes(id));
  }, [id]);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (wishlist.includes(id)) {
      wishlist = wishlist.filter((item) => item !== id);
      setIsSaved(false);
      Swal.fire({
        icon: "info",
        title: "Đã bỏ lưu tin",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      wishlist.push(id);
      setIsSaved(true);
      Swal.fire({
        icon: "success",
        title: "Đã lưu tin thành công",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  };

  const handleStar = () => {
    let stars = [];
    for (let i = 0; i < +star; i++) {
      stars.push(<GrStar key={i} className="star-item" size={14} color="#febb02" />);
    }
    return stars;
  };

  const getTitleStyle = (star) => {
    switch (+star) {
      case 5:
        return "text-[#E13427] font-bold text-lg leading-tight line-clamp-2 uppercase hover:underline"; // Đỏ
      case 4:
        return "text-[#E13491] font-bold text-lg leading-tight line-clamp-2 uppercase hover:underline"; // Hồng
      case 3:
        return "text-[#F57C00] font-bold text-lg leading-tight line-clamp-2 uppercase hover:underline"; // Cam
      case 2:
        return "text-[#1976D2] font-bold text-lg leading-tight line-clamp-2 uppercase hover:underline"; // Xanh
      default:
        return "text-[#055699] font-bold text-lg leading-tight line-clamp-2 hover:underline"; // Mặc định
    }
  };

  return (
    <div className="w-full flex gap-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Left: Image Grid */}
      <Link
        to={`/${path.DETAIL}/${formatVietnameseToString(title?.replaceAll("/", " "))}/${id}`}
        className="w-[40%] flex gap-[2px] h-[240px] relative rounded-lg overflow-hidden flex-shrink-0"
      >
        <div className="flex-1 h-full">
          <img
            src={images[0] || "https://via.placeholder.com/400x300?text=No+Image"}
            alt="preview"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-[35%] flex flex-col gap-[2px] h-full">
          <img
            src={images[1] || images[0] || "https://via.placeholder.com/200x150?text=No+Image"}
            alt="preview"
            className="w-full h-[119px] object-cover"
          />
          <img
            src={images[2] || images[0] || "https://via.placeholder.com/200x150?text=No+Image"}
            alt="preview"
            className="w-full h-[119px] object-cover"
          />
        </div>
        <span className="bg-black/60 text-white px-2 py-1 text-xs rounded-md absolute left-2 bottom-2 flex items-center gap-1">
          <icons.BsCameraFill size={14} />
          {images?.length || 0}
        </span>
      </Link>

      {/* Right: Content */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <Link
            to={`/${path.DETAIL}/${formatVietnameseToString(title?.replaceAll("/", " "))}/${id}`}
            className={getTitleStyle(star)}
          >
            <span className="inline-flex mr-1 align-middle">
              {handleStar().map((star, index) => star)}
            </span>
            {title}
          </Link>

          <div className="mt-2 flex items-center gap-4">
            <span className="font-bold text-[#16C784] text-lg">
              {attributes?.price}
            </span>
            <span className="text-gray-600 font-medium">{attributes?.acreage}</span>
          </div>

          <div className="mt-1 flex items-center gap-1 text-gray-500">
            <HiOutlineLocationMarker size={16} />
            <span className="text-sm line-clamp-1">
              {address?.split(",")?.slice(-2)?.join(", ")}
            </span>
          </div>

          <p className="mt-2 text-gray-400 text-sm line-clamp-2 italic">
            {description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <img
              src={user?.avatar || anonAvatar}
              alt="avatar"
              className="w-10 h-10 object-cover rounded-full border border-gray-100 shadow-sm"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800">{user?.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-400 italic">Mới đăng</span>
                {expired && (
                    <span className="text-[11px] text-red-500 font-medium">
                        • Hết hạn: {(() => {
                            if (expired.includes('/')) return expired;
                            const d = new Date(expired);
                            return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                        })()}
                    </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${user?.phone?.replace(/\D/g, "")}`}
              className="bg-[#16C784] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm hover:bg-[#13ad73] transition-colors"
            >
              {user?.phone}
            </a>
            <span
              className={`cursor-pointer transition-colors p-1 ${isSaved ? "text-red-500" : "text-gray-300 hover:text-red-500"}`}
              onMouseEnter={() => setIsHoverHeart(true)}
              onMouseLeave={() => setIsHoverHeart(false)}
              onClick={handleToggleWishlist}
            >
              {(isHoverHeart || isSaved) ? (
                <RiHeartFill size={22} color={isSaved ? "#f73859" : "#f73859"} />
              ) : (
                <RiHeartLine size={22} />
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Item);
