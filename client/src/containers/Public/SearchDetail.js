import { ItemSidebar, RelatePost } from "../../components";
import { List, Pagination } from "./index";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const SearchDetail = () => {
  const { prices, areas, categories, provinces } = useSelector(
    (state) => state.app,
  );
  const [searchParams] = useSearchParams();

  const getSingleLabel = (collection, key) => {
    const value = searchParams.get(key);
    if (!value) return "";
    return collection.find((item) => item.code === value)?.value || "";
  };

  const getMultiLabel = (collection, key, prefix) => {
    const labels = searchParams
      .getAll(key)
      .map((value) => collection.find((item) => item.code === value)?.value)
      .filter(Boolean);

    if (!labels.length) return "";
    return `${prefix} ${labels.join(", ")}`;
  };

  const categoryText = getSingleLabel(categories, "categoryCode");
  const provinceText = getSingleLabel(provinces, "provinceCode");
  const priceText = getMultiLabel(prices, "priceCode", "gia");
  const areaText = getMultiLabel(areas, "areaCode", "dien tich");
  const titleSearch = [
    categoryText || "Cho thue tat ca",
    provinceText ? `tinh ${provinceText}` : "",
    priceText,
    areaText,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full flex flex-col gap-3">
      <div>
        <h1 className="text-[28px] font-bold">{titleSearch}</h1>
        <p className="text-base text-gray-700">{`${titleSearch} phong moi xay gan truong hoc, khu an ninh`}</p>
      </div>
      <div className="w-full flex gap-4">
        <div className="w-[70%]">
          <List />
          <Pagination />
        </div>
        <div className="w-[30%] flex flex-col gap-4 justify-start items-center">
          <ItemSidebar
            isDouble={true}
            type="priceCode"
            content={prices}
            title="Xem theo giá"
          />
          <ItemSidebar
            isDouble={true}
            type="areaCode"
            content={areas}
            title="Xem theo diện tích"
          />
          <RelatePost />
        </div>
      </div>
    </div>
  );
};

export default SearchDetail;
