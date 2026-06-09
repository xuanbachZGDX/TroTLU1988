import React, { useEffect } from "react";
import { Button, Item } from "../../components";
import { getAllPostsLimit } from "../../store/actions/postAction";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import moment from "moment";

const parseDescription = (desc) => {
  if (!desc) return "";
  try {
    const parsed = JSON.parse(desc);
    return Array.isArray(parsed) ? parsed.join(" ") : parsed;
  } catch {
    return desc;
  }
};

const parseImages = (images) => {
  if (!images) return [];
  if (Array.isArray(images)) {
    return images.map((img) => img.image).filter(Boolean);
  }
  try {
    return JSON.parse(images) || [];
  } catch {
    return [];
  }
};

const List = ({ categoryCode }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { posts } = useSelector((state) => state.post);

  const [sort, setSort] = React.useState(0);

  useEffect(() => {
    let searchParamsObject = {};
    for (let [key, value] of searchParams.entries()) {
      if (searchParamsObject[key]) {
        if (Array.isArray(searchParamsObject[key])) {
          searchParamsObject[key].push(value);
        } else {
          searchParamsObject[key] = [searchParamsObject[key], value];
        }
      } else {
        searchParamsObject[key] = value;
      }
    }

    if (categoryCode) searchParamsObject.categoryCode = categoryCode;

    // Truyền tham số sắp xếp đơn giản
    if (sort === 1) searchParamsObject.order = "new";
    if (sort === 0) searchParamsObject.order = "star";

    dispatch(getAllPostsLimit(searchParamsObject));
  }, [dispatch, searchParams, categoryCode, sort]);

  return (
    <div className="w-full border p-2 bg-white shadow-md rounded-md px-6">
      <div className="flex items-center justify-between my-3">
        <h4 className="text-xl font-semibold">Danh sách tin đăng</h4>
        <span>Cập nhật: {moment().format("HH:mm DD/MM/YYYY")}</span>
      </div>
      <div className="flex items-center gap-6 my-4 border-b border-gray-100 pb-2">
        <span
          onClick={() => setSort(0)}
          className={`cursor-pointer pb-2 transition-all ${sort === 0 ? "text-black font-bold border-b-2 border-black" : "text-gray-500 hover:text-black"}`}
        >
          Đề xuất
        </span>
        <span
          onClick={() => setSort(1)}
          className={`cursor-pointer pb-2 transition-all ${sort === 1 ? "text-black font-bold border-b-2 border-black" : "text-gray-500 hover:text-black"}`}
        >
          Mới đăng
        </span>
      </div>
      <div className="items flex flex-col gap-4">
        {posts?.length > 0 ? (
          posts.map((item) => {
            return (
              <Item
                key={item?.id}
                address={item?.address}
                attributes={item?.attributes}
                description={parseDescription(item?.description)}
                images={parseImages(item?.images)}
                star={+item?.star}
                title={item?.title}
                user={item?.user}
                id={item?.id}
                expired={item?.expired}
              />
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <p className="text-gray-500 text-lg font-medium">
              Không tìm thấy kết quả phù hợp nào với tiêu chí tìm kiếm của bạn.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Vui lòng thử thay đổi các bộ lọc (khu vực, mức giá, diện tích) để
              tìm được phòng ưng ý hơn nhé!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
