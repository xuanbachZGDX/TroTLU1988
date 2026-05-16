import React, { useState, useEffect } from "react";
import { useNavigate, createSearchParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { path } from "../../../utils/constant";
import icons from "../../../utils/icons";
import * as actions from "../../../store/actions";
import {
  apiGetPublicDistrict,
  apiGetPublicWard,
} from "../../../services/appService";
import SearchModal from "./SearchModal";

const { HiOutlineLocationMarker, FiSearch } = icons;

const Search = () => {
  const dispatch = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { provinces, areas, prices, categories, features } = useSelector((s) => s.app);

  const [isOpen, setIsOpen] = useState(false);

  // Bộ lọc
  const [selCategory, setSelCategory] = useState(null); 
  const [selPrice,    setSelPrice]    = useState(null);
  const [selArea,     setSelArea]     = useState(null);
  const [selProvince, setSelProvince] = useState("");
  const [selDistrict, setSelDistrict] = useState("");
  const [selWard,     setSelWard]     = useState("");
  const [selFeatures, setSelFeatures] = useState([]);

  // Dữ liệu quận/phường
  const [districts, setDistricts] = useState([]);
  const [wards,     setWards]     = useState([]);

  // Reset khi rời trang search
  useEffect(() => {
    const isSearchPath = location.pathname.includes(path.SEARCH);
    const isHomePath = location.pathname === "/";
    
    if (!isSearchPath && !isHomePath) {
      handleReset();
    }
  }, [location]);

  useEffect(() => {
    if (selProvince) {
      const fetchDistricts = async () => {
        const response = await apiGetPublicDistrict(selProvince);
        if (response?.status === 200) {
          setDistricts(response?.data?.districts || []);
        } else {
          setDistricts([]);
        }
        setSelDistrict("");
        setSelWard("");
        setWards([]);
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setSelDistrict("");
      setWards([]);
      setSelWard("");
    }
  }, [selProvince]);

  useEffect(() => {
    if (selDistrict) {
      const fetchWards = async () => {
        const response = await apiGetPublicWard(selDistrict);
        if (response?.status === 200) {
          setWards(response?.data?.wards || []);
        } else {
          setWards([]);
        }
        setSelWard("");
      };
      fetchWards();
    } else {
      setWards([]);
      setSelWard("");
    }
  }, [selDistrict]);

  const toggleFeature = (f) =>
    setSelFeatures((prev) =>
      prev.some(x => x.code === f.code) ? prev.filter((x) => x.code !== f.code) : [...prev, f]
    );

  const handleReset = () => {
    setSelCategory(null);
    setSelPrice(null);
    setSelArea(null);
    setSelProvince("");
    setSelDistrict("");
    setSelWard("");
    setSelFeatures([]);
  };

  const handleApply = () => {
    const params = {};
    if (selCategory?.code) params.categoryCode = selCategory.code;
    if (selPrice?.code)    params.priceCode    = selPrice.code;
    if (selArea?.code)     params.areaCode     = selArea.code;
    
    const provinceName = provinces?.find((p) => p.code == selProvince)?.value || "";
    const districtName = districts?.find((d) => d.code == selDistrict)?.name || "";

    if (provinceName) params.province = provinceName;
    if (districtName) params.district = districtName;
    if (selFeatures.length > 0) params.features = selFeatures.map(f => f.code);

    let locationLabel = provinceName;
    if (districtName) locationLabel = `${districtName}, ${provinceName}`;

    const titleSearch = `${selCategory?.value || "Cho thuê tất cả"}${locationLabel ? ` tại ${locationLabel}` : ""}`;

    navigate(
      { pathname: `/${path.SEARCH}`, search: createSearchParams(params).toString() },
      { state: { titleSearch } }
    );
    setIsOpen(false);
  };

  const activeCount =
    [selCategory, selPrice, selArea].filter(Boolean).length +
    (selProvince ? 1 : 0) +
    selFeatures.length;

  const provinceLabel =
    provinces?.find((p) => p.code == selProvince)?.value || "";

  return (
    <>
      <div className="w-1100 max-w-full my-3 bg-white border border-gray-200 rounded-xl flex items-center gap-3 px-4 py-2.5 shadow-sm">
        <HiOutlineLocationMarker className="text-gray-400 flex-none" size={18} />

        <button
          onClick={() => setIsOpen(true)}
          className="flex-1 text-left text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          {provinceLabel || "Tìm theo khu vực..."}
        </button>

        <div className="h-5 w-px bg-gray-200" />

        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Bộ lọc
          {activeCount > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        <button
          onClick={handleApply}
          className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiSearch size={13} />
          Tìm kiếm
        </button>
      </div>

      {isOpen && (
        <SearchModal 
          setIsOpen={setIsOpen}
          handleReset={handleReset}
          categories={categories}
          selCategory={selCategory}
          setSelCategory={setSelCategory}
          selProvince={selProvince}
          setSelProvince={setSelProvince}
          provinces={provinces}
          selDistrict={selDistrict}
          setSelDistrict={setSelDistrict}
          districts={districts}
          selWard={selWard}
          setSelWard={setSelWard}
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
        />
      )}
    </>
  );
};

export default Search;
