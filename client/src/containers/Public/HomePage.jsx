import React from "react";
import { text } from "../../utils/constant";
import { Province, ItemSidebar, RelatePost } from "../../components";
import { List, Pagination } from "./index";
import { useSelector } from "react-redux";

const HomePage = () => {
  const { prices, areas } = useSelector((state) => state.app);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col items-center text-center gap-2 mb-6">
        <h1 className="text-[28px] font-bold text-gray-800 leading-tight">
          {text.HOME_TITLE}
        </h1>
        <p className="text-gray-500 max-w-[800px] text-[15px]">
          {text.HOME_DESCRIPTION}
        </p>
      </div>
      <div className="w-full flex gap-4">
        <div className="w-[70%]">
          <List />
          <Pagination />
        </div>
        <div className="w-[30%] flex flex-col gap-4 justify-start items-center">
          <ItemSidebar
            isDouble={true}
            type="priceCode"
            content={prices}
            title="Xem theo giá"
          />
          <ItemSidebar
            isDouble={true}
            type="areaCode"
            content={areas}
            title="Xem theo diện tích"
          />
          <RelatePost />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
