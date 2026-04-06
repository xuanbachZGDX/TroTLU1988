import React from "react";

const SmallItem = ({title, price, img, createdAt}) => {
  return (
    <div className="w-full flex items-start gap-3 py-2 border-b border-gray-300">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
        alt="Ảnh"
        className="w-[65px] h-[65px] object-cover rounded-md"
      />
      <div className="w-full flex-1 flex flex-col gap-1">
        <h4 className="text-blue-600 text-[15px]">
          {`${title?.slice(0, 45)}...`}
        </h4>
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-medium text-green-500">{price}</span> 
          <span className="text-sm text-gray-300">{createdAt}</span>
        </div>
      </div>
    </div>
  );
};

export default SmallItem;
