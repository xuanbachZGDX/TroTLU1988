import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { formatVietnameseToString } from "../../../utils/Common/formatVietnameseToString";
import { useDispatch, useSelector } from "react-redux";
import * as action from "../../../store/actions";
import { path } from "../../../utils/constant";
import logo from "../../../assets/TLU.jpg";

const notActive =
  "relative h-full flex items-center px-3 lg:px-4 text-white opacity-90 hover:opacity-100 transition-all duration-300 whitespace-nowrap " +
  "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[4px] after:bg-secondary2 " +
  "after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left";

const active =
  "relative h-full flex items-center px-3 lg:px-4 text-white font-bold whitespace-nowrap " +
  "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[4px] after:bg-secondary2";

const Navigation = ({ isAdmin, showLogo }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.app);
  useEffect(() => {
    dispatch(action.getAllCategories());
    dispatch(action.getPrices());
    dispatch(action.getAreas());
    dispatch(action.getProvinces());
  }, [dispatch]);

  const hasNewCategory = categories?.length > 7;

  return (
    <div
      className={`w-full flex items-center h-[60px] bg-gradient-to-r from-blue-700 to-blue-800 shadow-lg z-30`}
    >
      <div
        className={`w-full ${showLogo ? "px-6" : "max-w-[1100px] mx-auto"} flex h-full items-center text-[13px] font-semibold tracking-tight`}
      >
        {showLogo && (
          <NavLink
            to="/"
            className="flex items-center mr-10 flex-none hover:scale-105 transition-transform duration-200"
          >
            <div className="bg-white p-1 rounded-xl shadow-md border border-white/20 flex items-center justify-center">
              <img
                src={logo}
                alt="logo"
                className="h-[38px] w-auto object-contain"
              />
            </div>
          </NavLink>
        )}
        <div
          className={`flex-1 flex h-full items-center overflow-x-auto select-none ${hasNewCategory ? "custom-scrollbar" : "hide-scrollbar"}`}
        >
          <div className="h-full flex justify-center items-center flex-none">
            <NavLink
              to={`/`}
              className={({ isActive }) => (isActive ? active : notActive)}
            >
              TRANG CHỦ
            </NavLink>
          </div>
          {categories?.length > 0 &&
            categories.map((item) => {
              return (
                <div
                  key={item.code}
                  className="h-full flex justify-center items-center flex-none"
                >
                  <NavLink
                    to={`/${formatVietnameseToString(item.value)}`}
                    className={({ isActive }) =>
                      isActive ? active : notActive
                    }
                  >
                    {item.value.toUpperCase()}
                  </NavLink>
                </div>
              );
            })}
          <div className="h-full flex justify-center items-center flex-none">
            <NavLink
              to={`/${path.CONTACT}`}
              className={({ isActive }) => (isActive ? active : notActive)}
            >
              LIÊN HỆ
            </NavLink>
          </div>
          <div className="h-full flex justify-center items-center flex-none">
            <NavLink
              to={`/${path.BANG_GIA}`}
              className={({ isActive }) => (isActive ? active : notActive)}
            >
              BẢNG GIÁ
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
