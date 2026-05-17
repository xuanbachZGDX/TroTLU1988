import React, { useCallback, useEffect, useRef, useState } from "react";
import logo from "../../../assets/logo-phongtro.png";
import { User } from "../../../components";
import icons from "../../../utils/icons";
import { useNavigate, Link, useSearchParams, createSearchParams } from "react-router-dom";
import { path } from "../../../utils/constant";
import { formatVietnameseToString } from "../../../utils/Common/formatVietnameseToString";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../store/actions";
import { menuSystem } from "../../../utils/Menu/menuSystem.jsx";
import { apiGetPublicDistrict, apiGetPublicWard } from "../../../services/appService";
import FilterModal from "./FilterModal";
import UserMenu from "./UserMenu";
import { getRoleFromToken } from "../../../utils/Common/role";
import AdminBellNotification from "./AdminBellNotification";

const cleanName = (name) => {
  if (!name) return "";
  return name.replace(/Cho thuê\s+/g, "").replace(/Tỉnh\s+/g, "").replace(/Thành phố\s+/g, "").trim();
};

const { AiOutlineLogout, BsChevronDown, RiHeartLine, MdManageSearch, FiSearch, RiCrop2Line, MdOutlineHouseSiding, RiCropLine, HiOutlineUsers, MdOutlineApartment, MdOutlineMapsHomeWork } = icons;

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const handleLogout = () => {
    setIsLogoutLoading(true);
    setTimeout(() => {
      dispatch(actions.logout());
      setIsLogoutLoading(false);
    }, 1000);
  };

  const menuRef = useRef();
  const { isLoggedIn, token } = useSelector((state) => state.auth);
  const { currentData } = useSelector((state) => state.user);
  const { provinces, areas, prices, categories } = useSelector((s) => s.app);

  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [selCategory, setSelCategory] = useState(null);
  const [selProvince, setSelProvince] = useState("");
  const [selDistrict, setSelDistrict] = useState("");
  const [selWard, setSelWard] = useState("");
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selPrice, setSelPrice] = useState(null);
  const [selArea, setSelArea] = useState(null);

  // Giải mã role từ JWT token
  const tokenRole = React.useMemo(() => {
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64))?.role?.toLowerCase() || null;
    } catch {
      return null;
    }
  }, [token]);

  // Luôn dùng role từ currentData trước, fallback sang token
  const role = currentData?.role?.toLowerCase() || tokenRole;

  useEffect(() => {
    const categoryCode = searchParams.get("categoryCode");
    const provinceCode = searchParams.get("provinceCode");
    const districtCode = searchParams.get("districtCode");
    const priceCode = searchParams.get("priceCode");
    const areaCode = searchParams.get("areaCode");

    if (categories) setSelCategory(categories.find(c => c.code === categoryCode) || null);
    setSelProvince(provinceCode || "");
    setSelDistrict(districtCode || "");
    if (prices) setSelPrice(prices.find(p => p.code === priceCode) || null);
    if (areas) setSelArea(areas.find(a => a.code === areaCode) || null);

    if (!categoryCode) {
      const pathCategory = categories?.find(c => window.location.pathname.includes(formatVietnameseToString(c.value)));
      if (pathCategory) setSelCategory(pathCategory);
    }
  }, [searchParams, categories, prices, areas]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selProvince) {
        const response = await apiGetPublicDistrict(selProvince);
        if (response?.status === 200) setDistricts(response.data.districts || []);
      } else {
        setDistricts([]);
      }
    };
    fetchDistricts();
  }, [selProvince]);

  useEffect(() => {
    const fetchWards = async () => {
      if (selDistrict) {
        const response = await apiGetPublicWard(selDistrict);
        if (response?.status === 200) setWards(response.data.wards || []);
      } else {
        setWards([]);
      }
    };
    fetchWards();
  }, [selDistrict]);

  const handleLogin = useCallback((flag) => {
    navigate(`/${path.LOGIN}`, { state: { flag } });
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsShowMenu(false);
  }, [isLoggedIn]);

  const handleApply = () => {
    const params = {};
    if (selCategory?.code) params.categoryCode = selCategory.code;
    if (selPrice?.code) params.priceCode = selPrice.code;
    if (selArea?.code) params.areaCode = selArea.code;

    const provinceName = provinces?.find((p) => p.code == selProvince)?.value || "";
    const districtName = districts?.find((d) => d.code == selDistrict)?.name || "";
    const wardName = wards?.find((w) => w.code == selWard)?.name || "";

    if (provinceName) params.province = provinceName;
    if (districtName) params.district = districtName;
    if (wardName) params.ward = wardName;

    let locationLabel = cleanName(provinceName);
    if (districtName) locationLabel = `${cleanName(districtName)}, ${cleanName(provinceName)}`;
    if (wardName) locationLabel = `${wardName}, ${cleanName(districtName)}, ${cleanName(provinceName)}`;

    const titleSearch = `${selCategory?.value || "Cho thuê tất cả"}${locationLabel ? ` tại ${locationLabel}` : ""}`;

    navigate({
      pathname: `/${path.SEARCH}`,
      search: createSearchParams(params).toString(),
    }, { state: { titleSearch } });
    setIsFilterOpen(false);
  };

  const getCategoryIcon = (value) => {
    if (value.includes("Phòng trọ")) return <MdOutlineHouseSiding />;
    if (value.includes("Nhà nguyên căn") || value.includes("Nhà riêng")) return <MdOutlineMapsHomeWork />;
    if (value.includes("Ở ghép")) return <HiOutlineUsers />;
    if (value.includes("Mặt bằng")) return <RiCrop2Line />;
    if (value.includes("Căn hộ chung cư")) return <MdOutlineApartment />;
    return <MdOutlineHouseSiding />;
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {isLogoutLoading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/40 z-[999] flex flex-col items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-b-transparent"></div>
          <span className="text-white font-bold text-lg">Đang đăng xuất...</span>
        </div>
      )}
      <div className="w-[1200px] max-w-full mx-auto h-[75px] px-4 flex items-center justify-between gap-6">
        
        {/* Logo */}
        <Link to={"/"} onClick={() => window.scrollTo(0, 0)} className="flex-shrink-0">
          <img src={logo} alt="logo" className="w-[180px] h-[45px] object-contain" />
        </Link>

        {/* Minimalist Search Bar */}
        <div className="flex-1 max-w-[500px] flex items-center bg-gray-100 rounded-full border border-gray-200 overflow-hidden group focus-within:border-blue-400 focus-within:bg-white transition-all">
          <div className="flex items-center px-4 gap-2 flex-1">
            <FiSearch className="text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo khu vực" 
              className="bg-transparent border-none outline-none text-sm w-full py-2.5 text-gray-700"
              value={selProvince ? cleanName(provinces?.find(p => p.code == selProvince)?.value) : ""}
              readOnly
              onClick={() => setIsFilterOpen(true)}
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border-l border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RiCrop2Line size={18} />
            <span>Bộ lọc</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-5">
          <Link to={"/tin-da-luu"} className="flex flex-col items-center justify-center text-gray-600 hover:text-[#FF6600] transition-colors">
            <RiHeartLine size={22} />
            <span className="text-[11px] font-bold mt-0.5 whitespace-nowrap uppercase tracking-tighter">Tin đã lưu</span>
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-5 border-l border-gray-200 pl-5">
              {role === 'admin' && <AdminBellNotification />}
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
      </div>

      {/* Unified Filter Modal */}
      {isFilterOpen && (
        <FilterModal 
          setIsFilterOpen={setIsFilterOpen}
          categories={categories}
          getCategoryIcon={getCategoryIcon}
          selCategory={selCategory}
          setSelCategory={setSelCategory}
          selProvince={selProvince}
          setSelProvince={setSelProvince}
          provinces={provinces}
          setSelDistrict={setSelDistrict}
          setSelWard={setSelWard}
          selDistrict={selDistrict}
          districts={districts}
          selWard={selWard}
          wards={wards}
          prices={prices}
          selPrice={selPrice}
          setSelPrice={setSelPrice}
          areas={areas}
          selArea={selArea}
          setSelArea={setSelArea}
          handleApply={handleApply}
          cleanName={cleanName}
        />
      )}
    </div>
  );
};

export default Header;
