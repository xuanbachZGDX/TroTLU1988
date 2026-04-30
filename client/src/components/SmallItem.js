import React from "react";
import moment from "moment";
import "moment/locale/vi";
import { Link } from "react-router-dom";
import { formatVietnameseToString } from "../utils/Common/formatVietnameseToString";
import { path } from "../utils/constant";

const SmallItem = ({ id, title, price, image, createdAt }) => {
  const formatTime = (createdAt) => {
    moment.locale("vi");
    return moment(createdAt).fromNow();
  };

  // Tạo URL chi tiết theo cùng pattern với Item.js
  const detailUrl = `${path.DETAIL}/${formatVietnameseToString(
    title?.replaceAll("/", " ")
  )}/${id}`;

  return (
    <Link
      to={detailUrl}
      className="w-full flex items-start gap-3 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 rounded-md px-1 cursor-pointer"
    >
      {/* Ảnh thumbnail */}
      <div className="w-[72px] h-[56px] flex-none rounded-md overflow-hidden bg-gray-100">
        {image?.[0] ? (
          <img
            src={image[0]}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      {/* Nội dung */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* Tiêu đề */}
        <p className="text-blue-600 text-[13px] font-medium leading-snug line-clamp-2 hover:text-orange-500 transition-colors">
          {title}
        </p>

        {/* Giá + Thời gian */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-green-600 text-[12px] font-semibold">{price}</span>
          <span className="text-gray-400 text-[11px]">{formatTime(createdAt)}</span>
        </div>
      </div>
    </Link>
  );
};

export default SmallItem;
