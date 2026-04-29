import React from "react";
import userAvatar from "../../assets/user.png";
import { useSelector, useDispatch } from "react-redux";
import menuSidebar from "../../utils/menuSidebar";
import { NavLink } from "react-router-dom";
import * as actions from "../../store/actions";
import { AiOutlineLogout } from "react-icons/ai";

const active =
  "flex items-center gap-3 py-2 px-4 font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-lg shadow transition-all duration-200";
const notActive =
  "flex items-center gap-3 py-2 px-4 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 transition-all duration-200";

const Sidebar = () => {
  const { currentData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  return (
    <div className="w-[270px] min-h-screen flex-none p-5 flex flex-col gap-8 bg-white rounded-xl shadow-xl border border-blue-100">
      <div className="flex flex-col items-center gap-3">
        <img
          src={userAvatar}
          alt="avatar"
          className="w-20 h-20 object-cover rounded-full border-4 border-blue-200 shadow-lg mb-2"
        />
        <span className="font-semibold text-lg text-blue-700">
          {currentData?.name}
        </span>
        <span className="text-xs text-gray-400 mt-1">
          Mã thành viên:{" "}
          <span className="font-bold text-blue-500">
            {currentData?.id?.match(/\d/g).join("")?.slice(0, 6)}
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {menuSidebar.map((item) => (
          <NavLink
            className={({ isActive }) => (isActive ? active : notActive)}
            key={item.id}
            to={item?.path}
          >
            <span className="text-xl">{item?.icons}</span>
            <span className="text-base">{item.text}</span>
          </NavLink>
        ))}
        <span
          onClick={() => dispatch(actions.logout())}
          className={
            notActive +
            " mt-4 text-red-500 hover:bg-red-50 hover:text-red-700 font-semibold"
          }
        >
          <AiOutlineLogout className="text-xl" />
          <span className="text-base">Thoát</span>
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
