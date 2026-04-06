import React from "react";
import { SmallItem } from "./index";

const RelatePost = () => {
  return (
    <div className="w-full bg-white rounded-md p-4">
      <h3 className="font-semibold text-lg mb-4">Tin mới đăng</h3>
      <div className="w-full flex flex-col gap-2">
        <SmallItem
          title="Căn hộ mini đầy đủ nội thất gần mọi tiện ích ngay trung tâm P 26 Q. Bình Thạnh"
          price="5.8 triệu/tháng"
          createdAt="Hôm nay"
        />
        <SmallItem />
        <SmallItem />
      </div>
    </div>
  );
};

export default RelatePost;
