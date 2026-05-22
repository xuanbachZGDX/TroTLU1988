import React, { useCallback, useEffect, useState } from "react";
import logo from "../../../assets/TLU.jpg";
import icons from "../../../utils/icons";
import { useNavigate, Link, useSearchParams, createSearchParams } from "react-router-dom";
import { path } from "../../../utils/constant";
import { formatVietnameseToString } from "../../../utils/Common/formatVietnameseToString";
import { useSelector } from "react-redux";
import { apiGetPublicDistrict, apiGetPublicWard } from "../../../services/appService";
import FilterModal from "./FilterModal";
import HeaderSearchInput from "./HeaderSearchInput";
import HeaderActions from "./HeaderActions";

const cleanName = (name) => {
  if (!name) return "";
  return name.replace(/Cho thuê\s+/g, "").replace(/Tỉnh\s+/g, "").replace(/Thành phố\s+/g, "").trim();
};

const { MdOutlineHouseSiding, MdOutlineMapsHomeWork, HiOutlineUsers, RiCrop2Line, MdOutlineApartment } = icons;

const Header = () => {
  const navigate = useNavigate();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const handleLogin = useCallback((flag) => {
    navigate(`/${path.LOGIN}`, { state: { flag } });
  }, [navigate]);

  const { token } = useSelector((state) => state.auth);
  const { currentData } = useSelector((state) => state.user);
  const { provinces, areas, prices, categories, features } = useSelector((s) => s.app);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [selCategory, setSelCategory] = useState(null);
  const [selProvince, setSelProvince] = useState("");
  const [selDistrict, setSelDistrict] = useState("");
  const [selWard, setSelWard] = useState("");
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selPrice, setSelPrice] = useState(null);
  const [selArea, setSelArea] = useState(null);
  const [selFeatures, setSelFeatures] = useState([]);

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
    const priceCode = searchParams.get("priceCode");
    const areaCode = searchParams.get("areaCode");
    const provinceName = searchParams.get("province");

    if (categories) setSelCategory(categories.find(c => c.code === categoryCode) || null);

    let resolvedProvinceCode = "";
    if (provinces && provinceName) {
      const foundProv = provinces.find(p => p.value === provinceName);
      if (foundProv) resolvedProvinceCode = foundProv.code;
    }
    setSelProvince(resolvedProvinceCode);

    if (prices) setSelPrice(prices.find(p => p.code === priceCode) || null);
    if (areas) setSelArea(areas.find(a => a.code === areaCode) || null);

    if (!categoryCode) {
      const pathCategory = categories?.find(c => window.location.pathname.includes(formatVietnameseToString(c.value)));
      if (pathCategory) setSelCategory(pathCategory);
    }
  }, [searchParams, categories, prices, areas, provinces]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selProvince) {
        const response = await apiGetPublicDistrict(selProvince);
        if (response?.status === 200) {
          const list = response.data.districts || [];
          setDistricts(list);
          const dName = searchParams.get("district");
          if (dName) {
            const foundDist = list.find(d => d.name === dName || d.value === dName);
            if (foundDist) {
              setSelDistrict(foundDist.code);
            } else {
              setSelDistrict("");
            }
          } else {
            setSelDistrict("");
          }
        }
      } else {
        setDistricts([]);
        setSelDistrict("");
      }
    };
    fetchDistricts();
  }, [selProvince, searchParams]);

  useEffect(() => {
    const fetchWards = async () => {
      if (selDistrict) {
        const response = await apiGetPublicWard(selDistrict);
        if (response?.status === 200) {
          const list = response.data.wards || [];
          setWards(list);
          const wName = searchParams.get("ward");
          if (wName) {
            const foundWard = list.find(w => w.name === wName || w.value === wName);
            if (foundWard) {
              setSelWard(foundWard.code);
            } else {
              setSelWard("");
            }
          } else {
            setSelWard("");
          }
        }
      } else {
        setWards([]);
        setSelWard("");
      }
    };
    fetchWards();
  }, [selDistrict, searchParams]);

  const toggleFeature = (f) =>
    setSelFeatures((prev) =>
      prev.some(x => x.code === f.code) ? prev.filter((x) => x.code !== f.code) : [...prev, f]
    );

  const handleApply = () => {
    const params = {};
    if (selCategory?.code) params.categoryCode = selCategory.code;
    if (selPrice?.code) params.priceCode = selPrice.code;
    if (selArea?.code) params.areaCode = selArea.code;
    if (selFeatures.length > 0) params.features = selFeatures.map(f => f.code);

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
        <Link to={"/"} onClick={() => window.scrollTo(0, 0)} className="flex-shrink-0">
          <img src={logo} alt="logo" className="h-[48px] w-auto object-contain hover:scale-105 transition-transform duration-200" />
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
