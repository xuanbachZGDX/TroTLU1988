import React, { memo } from "react";
import icons from "../utils/icons";
import { formatVietnameseToString } from "../utils/Common/formatVietnameseToString";
import { Link } from "react-router-dom";
import * as actions from "../store/actions";
import { useDispatch } from "react-redux";
import { createSearchParams, useNavigate, useLocation } from "react-router-dom";

const { GrNext } = icons;

const ItemSidebar = ({ title, content, isDouble, type }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const formatContent = () => {
    const oddEle = content?.filter((item, index) => index % 2 !== 0);
    const evenEle = content?.filter((item, index) => index % 2 === 0);
    const formatContent = oddEle?.map((item, index) => {
      return {
        right: item,
        left: evenEle?.find((item2, index2) => index2 === index),
      };
    });
    return formatContent;
  };

  const handleFilterPosts = (code) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        [type]: code,
      }).toString(),
    });
  };

  return (
    <div className="p-4 rounded-md bg-white w-full">
      <h3 className="text-base font-semibold mb-4">{title}</h3>
      {!isDouble && (
        <div className="flex flex-col gap-2">
          {content?.length > 0 &&
            content.map((item) => {
              return (
                <Link
                  to={`${formatVietnameseToString(item.value)}`}
                  key={item.code}
                  className="flex gap-2 items-center cursor-pointer hover:text-orange-600 border-b border-gray-200 pb-1 border-dashed"
                >
                  <GrNext size={10} color="#ccc" />
                  <p className="text-sm">{item.value}</p>
                </Link>
              );
            })}
        </div>
      )}
      {isDouble && (
        <div className="flex flex-col gap-2">
          {content?.length > 0 &&
            formatContent(content).map((item, index) => {
              return (
                <div key={index}>
                  <div className="flex items-center justify-around">
                    <div
                      onClick={() => handleFilterPosts(item.left.code)}
                      className="flex flex-1 gap-2 items-center cursor-pointer hover:text-orange-600 border-b border-gray-200 pb-1 border-dashed"
                    >
                      <GrNext size={10} color="#ccc" />
                      <p className="text-xs">{item.left.value}</p>
                    </div>
                    <div
                      onClick={() => handleFilterPosts(item.right.code)}
                      className="flex flex-1 gap-2 items-center cursor-pointer hover:text-orange-600 border-b border-gray-200 pb-1 border-dashed"
                    >
                      <GrNext size={10} color="#ccc" />
                      <p className="text-xs">{item.right.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default memo(ItemSidebar);
