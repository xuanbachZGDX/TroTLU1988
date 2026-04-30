import React, { useState, useEffect } from "react";
import { useNavigate, createSearchParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { path } from "../../utils/constant";
import icons from "../../utils/icons";
import {
  apiGetPublicDistrict,
  apiGetPublicWard,
} from "../../services/appService";

const { HiOutlineLocationMarker, FiSearch } = icons;

// ── Pill button (tất cả / từng item) ─────────────────────────────────────────
const Pill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 text-sm rounded-full border transition-all ${
      active
        ? "border-orange-500 bg-orange-50 text-orange-600 font-semibold"
        : "border-gray-200 text-gray-600 hover:border-gray-400"
    }`}
  >
    {label}
  </button>
);

// ── Section heading ───────────────────────────────────────────────────────────
const SectionTitle = ({ children }) => (
  <h3 className="font-bold text-sm text-gray-800 mb-3">{children}</h3>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const Search = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { provinces, areas, prices, categories, features } = useSelector((s) => s.app);

  const [isOpen, setIsOpen] = useState(false);

  // Bộ lọc
  const [selCategory, setSelCategory] = useState(null); // { code, value }
  const [selPrice,    setSelPrice]    = useState(null);
  const [selArea,     setSelArea]     = useState(null);
  const [selProvince, setSelProvince] = useState("");
  const [selDistrict, setSelDistrict] = useState("");
  const [selWard,     setSelWard]     = useState("");
  const [selFeatures, setSelFeatures] = useState([]);

  // Dữ liệu quận/phường (gọi API ngoài)
  const [districts, setDistricts] = useState([]);
  const [wards,     setWards]     = useState([]);

  // Reset khi rời trang search
  useEffect(() => {
    if (!location.pathname.includes(path.SEARCH)) {
      setSelCategory(null);
      setSelPrice(null);
      setSelArea(null);
      setSelProvince("");
      setSelDistrict("");
      setSelWard("");
      setSelFeatures([]);
    }
  }, [location]);

  useEffect(() => {
    if (selProvince) {
      apiGetPublicDistrict(selProvince).then((res) => {
        setDistricts(res?.data?.districts || []);
        setSelDistrict("");
        setSelWard("");
        setWards([]);
      });
    } else {
      setDistricts([]);
      setSelDistrict("");
      setWards([]);
      setSelWard("");
    }
  }, [selProvince]);

  useEffect(() => {
    if (selDistrict) {
      apiGetPublicWard(selDistrict).then((res) => {
        setWards(res?.data?.wards || []);
        setSelWard("");
      });
    } else {
      setWards([]);
      setSelWard("");
    }
  }, [selDistrict]);

  const toggleFeature = (f) =>
    setSelFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
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
    if (selProvince)       params.provinceCode = selProvince;

    const provinceName = provinces?.find((p) => p.code == selProvince)?.value || "";
    const titleSearch = `${selCategory?.value || "Cho thuê tất cả"}${provinceName ? ` tại ${provinceName}` : ""}`;

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
      {/* ── Trigger bar ── */}
      <div className="w-1100 max-w-full my-3 bg-white border border-gray-200 rounded-xl flex items-center gap-3 px-4 py-2.5 shadow-sm">
        <HiOutlineLocationMarker className="text-gray-400 flex-none" size={18} />

        <button
          onClick={() => setIsOpen(true)}
          className="flex-1 text-left text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          {provinceLabel || "Tìm theo khu vực..."}
        </button>

        <div className="h-5 w-px bg-gray-200" />

        {/* Bộ lọc trigger */}
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

      {/* ── Filter Modal ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:w-[540px] max-h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-none">
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
              >
                Xóa tất cả
              </button>
              <h2 className="font-bold text-base text-gray-800">Bộ lọc</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-lg font-light"
              >
                ✕
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-5 py-5 space-y-6">

              {/* 1. Danh mục cho thuê */}
              <section>
                <SectionTitle>Danh mục cho thuê</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {categories?.map((cat) => (
                    <Pill
                      key={cat.code}
                      label={cat.value}
                      active={selCategory?.code === cat.code}
                      onClick={() =>
                        setSelCategory(selCategory?.code === cat.code ? null : cat)
                      }
                    />
                  ))}
                </div>
              </section>

              {/* 2. Lọc theo khu vực */}
              <section>
                <SectionTitle>Lọc theo khu vực</SectionTitle>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={selProvince}
                    onChange={(e) => setSelProvince(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 bg-white"
                  >
                    <option value="">Toàn quốc</option>
                    {provinces?.map((p) => (
                      <option key={p.code} value={p.code}>{p.value}</option>
                    ))}
                  </select>
                  <select
                    value={selDistrict}
                    onChange={(e) => setSelDistrict(e.target.value)}
                    disabled={!districts.length}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 bg-white disabled:opacity-40"
                  >
                    <option value="">Quận huyện</option>
                    {districts.map((d) => (
                      <option key={d.code} value={d.code}>{d.name}</option>
                    ))}
                  </select>
                  <select
                    value={selWard}
                    onChange={(e) => setSelWard(e.target.value)}
                    disabled={!wards.length}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 bg-white disabled:opacity-40"
                  >
                    <option value="">Phường xã</option>
                    {wards.map((w) => (
                      <option key={w.code} value={w.code}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </section>

              {/* 3. Khoảng giá */}
              <section>
                <SectionTitle>Khoảng giá</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  <Pill label="Tất cả" active={!selPrice} onClick={() => setSelPrice(null)} />
                  {prices?.map((p) => (
                    <Pill
                      key={p.code}
                      label={p.value}
                      active={selPrice?.code === p.code}
                      onClick={() => setSelPrice(selPrice?.code === p.code ? null : p)}
                    />
                  ))}
                </div>
              </section>

              {/* 4. Khoảng diện tích */}
              <section>
                <SectionTitle>Khoảng diện tích</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  <Pill label="Tất cả" active={!selArea} onClick={() => setSelArea(null)} />
                  {areas?.map((a) => (
                    <Pill
                      key={a.code}
                      label={a.value}
                      active={selArea?.code === a.code}
                      onClick={() => setSelArea(selArea?.code === a.code ? null : a)}
                    />
                  ))}
                </div>
              </section>

              {/* 5. Đặc điểm nổi bật */}
              <section>
                <SectionTitle>Đặc điểm nổi bật</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {features?.map((f) => (
                    <Pill
                      key={f}
                      label={f}
                      active={selFeatures.includes(f)}
                      onClick={() => toggleFeature(f)}
                    />
                  ))}
                </div>
              </section>
            </div>

            {/* Apply */}
            <div className="px-5 py-4 border-t border-gray-100 flex-none">
              <button
                onClick={handleApply}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-base transition-colors"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
