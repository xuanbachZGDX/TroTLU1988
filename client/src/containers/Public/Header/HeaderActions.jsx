import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import icons from "../../../utils/icons";
import { path } from "../../../utils/constant";
import { menuSystem } from "../../../utils/Menu/menuSystem.jsx";
import UserMenu from "./UserMenu";
import { User } from "../../../components";
import AdminBellNotification from "./AdminBellNotification";
import * as actions from "../../../store/actions";

const { RiHeartLine, MdManageSearch, BsChevronDown } = icons;

const HeaderActions = ({ role, handleLogin, setIsLogoutLoading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuRef = useRef();

  const { isLoggedIn } = useSelector((state) => state.auth);
  const [isShowMenu, setIsShowMenu] = useState(false);

  const handleLogout = () => {
    setIsLogoutLoading(true);
    setTimeout(() => {
      dispatch(actions.logout());
      setIsLogoutLoading(false);
    }, 1000);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    setIsShowMenu(false);
  }, [isLoggedIn]);

  return (
    <div className="flex items-center gap-5">
      <Link to={"/tin-da-luu"} className="flex flex-col items-center justify-center text-gray-600 hover:text-[#FF6600] transition-colors">
        <RiHeartLine size={22} />
        <span className="text-[11px] font-bold mt-0.5 whitespace-nowrap uppercase tracking-tighter">Tin đã lưu</span>
      </Link>

      {isLoggedIn ? (
        <div className="flex items-center gap-5 border-l border-gray-200 pl-5">
          {(role === 'admin' || role === 'landlord') && <AdminBellNotification />}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsShowMenu(!isShowMenu)}
              className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <MdManageSearch size={24} />
              <span className="text-[11px] font-bold mt-0.5 whitespace-nowrap uppercase tracking-tighter">Quản lý</span>
            </button>
            {isShowMenu && (
              <UserMenu 
                menuSystem={menuSystem} 
                role={role} 
                handleLogout={handleLogout} 
                setIsShowMenu={setIsShowMenu} 
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <User />
            <BsChevronDown size={12} className="text-gray-400" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 text-sm font-bold text-gray-700">
          <button onClick={() => handleLogin(false)} className="hover:text-blue-600">Đăng nhập</button>
          <button onClick={() => handleLogin(true)} className="hover:text-blue-600 border-l border-gray-300 pl-4">Đăng ký</button>
        </div>
      )}

      {(!isLoggedIn || role === 'landlord') && (
        <button 
          onClick={() => navigate(`/${path.SYSTEM}/${path.CREATE_POST}`)}
          className="bg-[#FF6600] text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-bold shadow-md hover:bg-[#e65c00] transition-all active:scale-95"
        >
          <icons.ImPencil2 size={14} />
          <span>Đăng tin</span>
        </button>
      )}
    </div>
  );
};

export default HeaderActions;
