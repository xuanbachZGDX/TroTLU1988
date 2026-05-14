import React from "react";
import FilterPill from "./FilterPill";

const FilterModal = ({
  setIsFilterOpen,
  categories,
  getCategoryIcon,
  selCategory,
  setSelCategory,
  selProvince,
  setSelProvince,
  provinces,
  setSelDistrict,
  setSelWard,
  selDistrict,
  districts,
  selWard,
  wards,
  prices,
  selPrice,
  setSelPrice,
  areas,
  selArea,
  setSelArea,
  handleApply,
  cleanName
}) => {
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={() => setIsFilterOpen(false)}
    >
      <div 
        className="bg-white w-full max-w-[650px] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Bộ lọc</h2>
          <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-gray-700 text-2xl transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 scrollbar-hide">
          <section>
            <h3 className="text-[15px] font-bold text-gray-800 mb-4 uppercase tracking-wide">Danh mục cho thuê</h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {categories?.map((cat) => (
                <FilterPill
                  key={cat.code}
                  label={cat.value}
                  icon={getCategoryIcon(cat.value)}
                  active={selCategory?.code === cat.code}
                  onClick={() => setSelCategory(selCategory?.code === cat.code ? null : cat)}
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[15px] font-bold text-gray-800 mb-4 uppercase tracking-wide">Lọc theo khu vực</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-gray-500 ml-1">Tỉnh thành</label>
                <select
                  value={selProvince}
                  onChange={(e) => {
                    setSelProvince(e.target.value);
                    setSelDistrict("");
                    setSelWard("");
                  }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF6600] bg-gray-50 font-medium cursor-pointer"
                >
                  <option value="">Toàn quốc</option>
                  {provinces?.map((p) => (
                    <option key={p.code} value={p.code}>{cleanName(p.value)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-gray-500 ml-1">Quận huyện</label>
                <select
                  value={selDistrict}
                  onChange={(e) => {
                    setSelDistrict(e.target.value);
                    setSelWard("");
                  }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF6600] bg-gray-50 font-medium disabled:opacity-50 cursor-pointer"
                  disabled={!selProvince}
                >
                  <option value="">Tất cả</option>
                  {districts?.map((d) => (
                    <option key={d.code} value={d.code}>{d.name || d.value || cleanName(d.value)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-gray-500 ml-1">Phường xã</label>
                <select
                  value={selWard}
                  onChange={(e) => setSelWard(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF6600] bg-gray-50 font-medium disabled:opacity-50 cursor-pointer"
                  disabled={!selDistrict}
                >
                  <option value="">Tất cả</option>
                  {wards?.map((w) => (
                    <option key={w.code} value={w.code}>{w.name || w.value}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[15px] font-bold text-gray-800 mb-4 uppercase tracking-wide">Khoảng giá</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelPrice(null)}
                className={`px-5 py-2 text-sm rounded-full border transition-all ${!selPrice ? "border-[#FF6600] bg-[#FFF5EE] text-[#FF6600] font-bold" : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"}`}
              >
                Tất cả
              </button>
              {prices?.map((p) => (
                <button
                  key={p.code}
                  onClick={() => setSelPrice(selPrice?.code === p.code ? null : p)}
                  className={`px-5 py-2 text-sm rounded-full border transition-all ${selPrice?.code === p.code ? "border-[#FF6600] bg-[#FFF5EE] text-[#FF6600] font-bold" : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"}`}
                >
                  {p.value}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[15px] font-bold text-gray-800 mb-4 uppercase tracking-wide">Diện tích</h3>
            <div className="flex flex-wrap gap-2">
              {areas?.map((a) => (
                <button
                  key={a.code}
                  onClick={() => setSelArea(selArea?.code === a.code ? null : a)}
                  className={`px-5 py-2 text-sm rounded-full border transition-all ${selArea?.code === a.code ? "border-[#FF6600] bg-[#FFF5EE] text-[#FF6600] font-bold" : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"}`}
                >
                  {a.value}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50">
          <button 
            onClick={handleApply}
            className="w-full bg-[#FF6600] hover:bg-[#e65c00] text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Áp dụng</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
