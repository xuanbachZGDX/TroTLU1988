import { ItemSidebar, RelatePost } from "../../../components";
import { List, Pagination } from "../index";
import { useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";

const SearchDetail = () => {
  const { prices, areas, categories, provinces } = useSelector(
    (state) => state.app,
  );
  const [searchParams] = useSearchParams();
  const location = useLocation();

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
  const provinceText = searchParams.get("province") || getSingleLabel(provinces, "provinceCode");
  const districtText = searchParams.get("district") || "";
  
  const priceText =
    location.state?.queryTextObj?.price ||
    getMultiLabel(prices, "priceCode", "giá");
  const areaText =
    location.state?.queryTextObj?.area ||
    getMultiLabel(areas, "areaCode", "diện tích");
    
  let locationText = provinceText;
  if (districtText) locationText = `${districtText}, ${provinceText}`;

  const getSubTitleByCategory = (category) => {
    switch (category) {
      case "Phòng trọ":
        return "Phòng trọ, nhà trọ chính chủ, đầy đủ tiện ích, giá rẻ, an ninh đảm bảo, phù hợp cho sinh viên và người đi làm.";
      case "Căn hộ":
        return "Căn hộ chung cư cao cấp, đầy đủ nội thất, tiện ích hiện đại, môi trường sống văn minh, view đẹp thoáng mát.";
      case "Nhà nguyên căn":
        return "Nhà nguyên căn chính chủ, không gian rộng rãi, phù hợp cho hộ gia đình ở lâu dài hoặc làm văn phòng kinh doanh.";
      case "Mặt bằng":
        return "Vị trí đắc địa, mặt tiền rộng, giao thông thuận tiện, cơ hội kinh doanh sinh lời cao cho mọi ngành nghề.";
      case "Tìm người ở ghép":
        return "Phòng sạch sẽ, chi phí tiết kiệm, tìm bạn cùng phòng văn minh, lịch sự, giờ giấc tự do.";
      default:
        return "Kênh thông tin cho thuê bất động sản uy tín, giá rẻ, cập nhật tin đăng mới mỗi ngày, tiếp cận hàng triệu khách hàng.";
    }
  };

  const titleSearch = [
    categoryText ? `Cho thuê ${categoryText.toLowerCase()}` : "Cho thuê phòng trọ",
    locationText ? `tại ${locationText}` : "",
    priceText ? `giá ${priceText.replace("giá ", "")}` : "",
    areaText ? `diện tích ${areaText.replace("diện tích ", "")}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const subTitleSearch = `${categoryText || "Phòng trọ"} tại khu vực ${locationText || "Việt Nam"}. ${getSubTitleByCategory(categoryText)}`;

  return (
    <div className="w-full flex flex-col gap-3">
      <div>
        <h1 className="text-[28px] font-bold capitalize">{titleSearch}</h1>
        <p className="text-base text-gray-700">{subTitleSearch}</p>
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
