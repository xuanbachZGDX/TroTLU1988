import React, { memo } from "react";
import icons from "../../utils/icons";
import { formatVietnameseToString } from "../../utils/Common/formatVietnameseToString";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createSearchParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";

const { BsChevronRight } = icons;

const ItemSidebar = ({ title, content, isDouble, type }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { categories } = useSelector((state) => state.app);

  const activeCode = searchParams.get(type);

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
    let currentQuery = {};
    for (let [key, value] of searchParams.entries()) {
      if (currentQuery[key]) {
        if (Array.isArray(currentQuery[key])) {
          currentQuery[key].push(value);
        } else {
          currentQuery[key] = [currentQuery[key], value];
        }
      } else {
        currentQuery[key] = value;
      }
    }

    if (currentQuery[type] === code) {
      delete currentQuery[type];
    } else {
      currentQuery[type] = code;
    }

    const categoryPaths = categories?.map(c => `/${formatVietnameseToString(c.value)}`) || [];
    const isListPath = location.pathname === '/' || location.pathname.includes('/tim-kiem') || categoryPaths.includes(location.pathname);
    const targetPath = isListPath ? location.pathname : '/tim-kiem';

    navigate(
      {
        pathname: targetPath,
        search: createSearchParams(currentQuery).toString(),
      },
      { state: location.state },
    );
  };

  return (
    <div className="p-4 rounded-md bg-white w-full shadow-sm">
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
                  <BsChevronRight size={10} className="text-gray-400" />
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
              const isLeftActive = activeCode === item.left?.code;
              const isRightActive = activeCode === item.right?.code;

              return (
                <div key={index}>
                  <div className="flex items-center justify-around">
                    {item.left && (
                      <div
                        onClick={() => handleFilterPosts(item.left.code)}
                        className={`flex flex-1 gap-2 items-center cursor-pointer border-b border-gray-200 pb-1 border-dashed transition-all ${
                          isLeftActive ? "text-orange-600 font-bold" : "hover:text-orange-600 text-gray-700"
                        }`}
                      >
                        <BsChevronRight size={10} className={isLeftActive ? "text-orange-600 font-bold" : "text-gray-400"} />
                        <p className="text-xs">{item.left.value}</p>
                      </div>
                    )}
                    {item.right && (
                      <div
                        onClick={() => handleFilterPosts(item.right.code)}
                        className={`flex flex-1 gap-2 items-center cursor-pointer border-b border-gray-200 pb-1 border-dashed transition-all ${
                          isRightActive ? "text-orange-600 font-bold" : "hover:text-orange-600 text-gray-700"
                        }`}
                      >
                        <BsChevronRight size={10} className={isRightActive ? "text-orange-600 font-bold" : "text-gray-400"} />
                        <p className="text-xs">{item.right.value}</p>
                      </div>
                    )}
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
