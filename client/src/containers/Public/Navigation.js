import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { formatVietnameseToString } from "../../utils/Common/formatVietnameseToString";
import { useDispatch, useSelector } from "react-redux";
import * as action from "../../store/actions";

const notActive =
  "relative h-full flex items-center px-3 lg:px-4 text-white opacity-80 hover:opacity-100 transition-all duration-300 whitespace-nowrap " +
  "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[4px] after:bg-secondary2 " +
  "after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left";

const active =
  "relative h-full flex items-center px-3 lg:px-4 text-white font-medium whitespace-nowrap " +
  "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[4px] after:bg-secondary2";

const Navigation = ({ isAdmin }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { categories } = useSelector((state) => state.app);
  useEffect(() => {
    dispatch(action.getAllCategories());
  }, [dispatch]);

  return (
    <div
      className={`w-full flex ${isAdmin ? "justify-start" : "justify-center"} items-center h-[54px] bg-secondary1 shadow-md`}
    >
      <div className="w-1100 max-w-full flex h-full items-center text-sm font-medium overflow-x-auto hide-scrollbar">
        <div className="h-full flex justify-center items-center">
          <NavLink
            to={`/`}
            className={({ isActive }) => (isActive ? active : notActive)}
          >
            Trang chủ
          </NavLink>
        </div>
        {categories?.length > 0 &&
          categories.map((item) => {
            return (
              <div
                key={item.code}
                className="h-full flex justify-center items-center"
              >
                <NavLink
                  to={`/${formatVietnameseToString(item.value)}`}
                  className={({ isActive }) => (isActive ? active : notActive)}
                >
                  {item.value}
                </NavLink>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Navigation;
