import React, { memo } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useLocation } from "react-router-dom";

const notActive =
  "w-[46px] h-[48px] flex justify-center items-center bg-white hover:bg-gray-300 rounded-md";
const active =
  "w-[46px] h-[48px] flex justify-center items-center bg-[#E13427] text-white hover:opacity-90 rounded-md";

const PageNumber = ({ text, currentPage, icon, setCurrentPage, type }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paramsSearch] = useSearchParams();
  const handleChangePage = () => {
    if (text !== "...") {
      setCurrentPage(+text);
      const newSearchParams = new URLSearchParams(paramsSearch);
      newSearchParams.set("page", text);
      navigate({
        pathname: location.pathname,
        search: newSearchParams.toString(),
      });
    }
  };
  return (
    <div
      className={
        +text === +currentPage
          ? `${active} ${text === "..." ? "cursor-text" : "cursor-pointer"}`
          : `${notActive} ${text === "..." ? "cursor-text" : "cursor-pointer"}`
      }
      onClick={handleChangePage}
    >
      {icon || text}
    </div>
  );
};

export default memo(PageNumber);
