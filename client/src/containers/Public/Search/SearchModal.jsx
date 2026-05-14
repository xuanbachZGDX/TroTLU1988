import React from "react";

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

const SectionTitle = ({ children }) => (
  <h3 className="font-bold text-sm text-gray-800 mb-3">{children}</h3>
);

const SearchModal = ({
  setIsOpen,
  handleReset,
  categories,
  selCategory,
  setSelCategory,
  selProvince,
  setSelProvince,
  provinces,
  selDistrict,
  setSelDistrict,
  districts,
  selWard,
  setSelWard,
  wards,
  prices,
  selPrice,
  setSelPrice,
  areas,
  selArea,
  setSelArea,
  features,
  selFeatures,
  toggleFeature,
  handleApply
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:w-[540px] max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
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

        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-6">
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
                  <option key={d.code} value={d.code}>{d.name || d.value}</option>
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
                  <option key={w.code} value={w.code}>{w.name || w.value}</option>
                ))}
              </select>
            </div>
          </section>

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

          <section>
            <SectionTitle>Đặc điểm nổi bật</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {features?.map((f) => (
                <Pill
                  key={f.code}
                  label={f.value}
                  active={selFeatures.some(x => x.code === f.code)}
                  onClick={() => toggleFeature(f)}
                />
              ))}
            </div>
          </section>
        </div>

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
  );
};

export default SearchModal;
