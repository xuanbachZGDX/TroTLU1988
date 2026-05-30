import React, { useCallback, useState } from "react";
import logo from "../../../assets/TLU.jpg";
import icons from "../../../utils/icons";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { path } from "../../../utils/constant";
import { useSelector } from "react-redux";
import FilterModal from "./FilterModal";
import HeaderSearchInput from "./HeaderSearchInput";
import HeaderActions from "./HeaderActions";
import { useHeaderSearchState } from "./useHeaderSearchState";

const cleanName = (name) => {
  if (!name) return "";
  return name
    .replace(/Cho thuê\s+/g, "")
    .replace(/Tỉnh\s+/g, "")
    .replace(/Thành phố\s+/g, "")
    .trim();
};

const {
  MdOutlineHouseSiding,
  MdOutlineMapsHomeWork,
  HiOutlineUsers,
  RiCrop2Line,
  MdOutlineApartment,
} = icons;

const Header = () => {
  const navigate = useNavigate();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const handleLogin = useCallback(
    (flag) => {
      navigate(`/${path.LOGIN}`, { state: { flag } });
    },
    [navigate],
  );

  const { token } = useSelector((state) => state.auth);
  const { currentData } = useSelector((state) => state.user);
  const { provinces, areas, prices, categories, features } = useSelector(
    (s) => s.app,
  );

  const {
    isFilterOpen,
    setIsFilterOpen,
    selCategory,
    setSelCategory,
    selProvince,
    setSelProvince,
    selDistrict,
    setSelDistrict,
    selWard,
    setSelWard,
    districts,
    wards,
    selPrice,
    setSelPrice,
    selArea,
    setSelArea,
    selFeatures,
    toggleFeature,
    handleApply,
  } = useHeaderSearchState({
    searchParams,
    categories,
    provinces,
    prices,
    areas,
    navigate,
    path,
    cleanName,
  });

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

  const role = currentData?.role?.toLowerCase() || tokenRole;

  const getCategoryIcon = (value) => {
    if (value.includes("Phòng trọ")) return <MdOutlineHouseSiding />;
    if (value.includes("Nhà nguyên căn") || value.includes("Nhà riêng"))
      return <MdOutlineMapsHomeWork />;
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
          <span className="text-white font-bold text-lg">
            Đang đăng xuất...
          </span>
        </div>
      )}
      <div className="w-[1200px] max-w-full mx-auto h-[75px] px-4 flex items-center justify-between gap-6">
        <Link
          to={"/"}
          onClick={() => window.scrollTo(0, 0)}
          className="flex-shrink-0"
        >
          <img
            src={logo}
            alt="logo"
            className="h-[48px] w-auto object-contain hover:scale-105 transition-transform duration-200"
          />
        </Link>

        <HeaderSearchInput
          selProvince={selProvince}
          provinces={provinces}
          cleanName={cleanName}
          setIsFilterOpen={setIsFilterOpen}
        />

        <HeaderActions
          role={role}
          handleLogin={handleLogin}
          setIsLogoutLoading={setIsLogoutLoading}
        />
      </div>

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
          features={features}
          selFeatures={selFeatures}
          toggleFeature={toggleFeature}
          handleApply={handleApply}
          cleanName={cleanName}
        />
      )}
    </div>
  );
};

export default Header;
