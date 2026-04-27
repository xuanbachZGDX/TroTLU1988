import React, { useCallback, useEffect, useRef, useState } from "react";
import logo from "../../assets/logo-phongtro.png";
import { Button, User } from "../../components";
import icons from "../../utils/icons";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { path } from "../../utils/constant";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../store/actions";
import menuManage from "../../utils/menuManage";

const { AiFillPlusCircle, AiOutlineLogout, BsChevronDown } = icons;

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const headerRef = useRef();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const handleLogin = useCallback(
    (flag) => {
      navigate(`/${path.LOGIN}`, { state: { flag } });
    },
    [navigate],
  );

  const page = searchParams.get("page");

  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  return (
    <div ref={headerRef} className="w-3/5">
      <div className="w-full flex items-center justify-between">
        <Link to={"/"}>
          <img
            src={logo}
            alt="logo"
            className="w-[240px] h-[70px] object-contain"
          />
        </Link>

        <div className="flex items-center gap-1">
          {!isLoggedIn && (
            <div className="flex items-center gap-1">
              <small>Phongtro123.com xin chào!</small>
              <Button
                text={"Đăng nhập"}
                textColor="text-white"
                bgColor="bg-[#3961fb]"
                onClick={() => handleLogin(false)}
              />
              <Button
                text={"Đăng ký"}
                textColor="text-white"
                bgColor="bg-[#3961fb]"
                onClick={() => handleLogin(true)}
              />
            </div>
          )}
          {isLoggedIn && (
            <div className="flex items-center gap-3 relative">
              <User />
              <Button
                text={"Quản lý tài khoản"}
                textColor="text-white"
                bgColor="bg-blue-700"
                px="px-4"
                IcAfter={BsChevronDown}
                onClick={() => setIsShowMenu((prev) => !prev)}
              />
              {isShowMenu && (
                <div className="absolute min-w-[240px] top-[calc(100%+8px)] right-0 bg-white shadow-xl border border-gray-100 rounded-xl py-3 flex flex-col z-50">
                  <div className="flex flex-col px-2">
                    {menuManage.map((item) => {
                      return (
                        <Link
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-secondary1 transition-colors duration-200 font-medium text-[15px]"
                          key={item.id}
                          to={item?.path}
                          onClick={() => setIsShowMenu(false)}
                        >
                          <span className="text-xl text-blue-500">{item?.icons}</span>
                          {item.text}
                        </Link>
                      );
                    })}
                  </div>
                  
                  <div className="h-[1px] bg-gray-200 my-2 w-full"></div>
                  
                  <div className="px-2">
                    <span
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors duration-200 font-medium text-[15px]"
                      onClick={() => {
                        setIsShowMenu(false);
                        dispatch(actions.logout());
                      }}
                    >
                      <span className="text-xl"><AiOutlineLogout /></span>
                      Đăng xuất
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          <Button
            text={"Đăng tin mới"}
            textColor="text-white"
            bgColor="bg-secondary2"
            IcAfter={AiFillPlusCircle}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
