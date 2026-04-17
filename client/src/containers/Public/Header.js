import React, { useCallback, useEffect, useRef, useState } from "react";
import logo from "../../assets/logo-phongtro.png";
import { Button } from "../../components";
import icons from "../../utils/icons";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { path } from "../../utils/constant";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../store/actions";
import menuManage from "../../utils/menuManage";

const { AiFillPlusCircle, AiOutlineLogout } = icons;

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const headerRef = useRef();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { currentData } = useSelector((state) => state.user);
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
            <div className="flex items-center gap-1 relative">
              <small>{currentData?.name || ""}</small>
              <Button
                text={"Quản lý tài khoản"}
                textColor="text-white"
                bgColor="bg-blue-700"
                px="px-4"
                onClick={() => setIsShowMenu((prev) => !prev)}
              />
              {isShowMenu && (
                <div className="absolute min-w-[220px] top-full right-0 bg-white shadow-md rounded-md p-4 flex flex-col">
                  {menuManage.map((item) => {
                    return (
                      <Link
                        className="flex items-center gap-2 hover:text-orange-500 text-blue-600 border-b border-gray-200 py-2"
                        key={item.id}
                        to={item?.path}
                      >
                        {item?.icons}
                        {item.text}
                      </Link>
                    );
                  })}
                  <span
                    className="flex items-center gap-2 cursor-pointer hover:text-orange-600 text-blue-500 border-gray-500 py-2"
                    onClick={() => {
                      setIsShowMenu(false);
                      dispatch(actions.logout());
                    }}
                  >
                    <AiOutlineLogout />
                    Đăng xuất
                  </span>
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
