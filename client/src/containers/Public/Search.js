import React, { useCallback, useState } from "react";
import { SearchItem, Modal } from "../../components";
import icons from "../../utils/icons";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import * as actions from "../../store/actions";
import { useNavigate, useLocation, createSearchParams } from "react-router-dom";

const {
  BsChevronRight,
  HiOutlineLocationMarker,
  TbReportMoney,
  RiCrop2Line,
  MdOutlineHouseSiding,
  FiSearch,
} = icons;

const Search = () => {
  const dispatch = useDispatch();
  const [isShowModal, setIsShowModal] = useState(false);

  const [content, setContent] = useState([]);
  const [name, setName] = useState("");

  const { provinces, areas, prices, categories } = useSelector(
    (state) => state.app,
  );
  const [queries, setQueries] = useState({});
  const [arrMinMax, setArrMinMax] = useState({});

  const handleShowModal = (content, name) => {
    setContent(content);
    setName(name);
    setIsShowModal(true);
  };

  const handleSubmit = useCallback((e, query, arrMinMax) => {
    e.stopPropagation();
    setQueries((prev) => ({ ...prev, ...query }));
    setIsShowModal(false);
    arrMinMax && setArrMinMax((prev) => ({ ...prev, ...arrMinMax }));
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = () => {
    const queryCode = Object.entries(queries).filter((item) =>
      item[0].includes("Code"),
    );
    let queryCodeObj = {};
    queryCode.forEach((item) => {
      queryCodeObj[item[0]] = item[1];
    });

    navigate({
      pathname: location.pathname !== "/" && location.pathname !== "/cho-thue-phong-tro" && location.pathname !== "/cho-thue-can-ho" && location.pathname !== "/cho-thue-mat-bang" && location.pathname !== "/nha-cho-thue" ? "/" : location.pathname,
      search: createSearchParams(queryCodeObj).toString(),
    });
  };

  return (
    <>
      <div className="p-[10px] w-3/5 my-3 bg-[#febb02] rounded-lg flex-col lg:flex-row flex items-center justify-around gap-2">
        <span
          onClick={() => handleShowModal(categories, "category")}
          className="flex-1 cursor-pointer"
        >
          <SearchItem
            IconBefore={<MdOutlineHouseSiding />}
            fontWeight
            IconAfter={<BsChevronRight color="rgb(156, 163, 175)" />}
            text={queries.category}
            defaultText={"Phòng trọ, nhà trọ"}
          />
        </span>
        <span
          onClick={() => handleShowModal(provinces, "province")}
          className="flex-1 cursor-pointer"
        >
          <SearchItem
            IconBefore={<HiOutlineLocationMarker />}
            IconAfter={<BsChevronRight color="rgb(156, 163, 175)" />}
            text={queries.province}
            defaultText={"Toàn quốc"}
          />
        </span>
        <span
          onClick={() => handleShowModal(prices, "price")}
          className="flex-1 cursor-pointer"
        >
          <SearchItem
            IconBefore={<TbReportMoney />}
            IconAfter={<BsChevronRight color="rgb(156, 163, 175)" />}
            text={queries.price}
            defaultText={"Chọn giá"}
          />
        </span>
        <span
          onClick={() => handleShowModal(areas, "area")}
          className="flex-1 cursor-pointer"
        >
          <SearchItem
            IconBefore={<RiCrop2Line />}
            IconAfter={<BsChevronRight color="rgb(156, 163, 175)" />}
            text={queries.area}
            defaultText={"Chọn diện tích"}
          />
        </span>
        <button
          type="button"
          onClick={handleSearch}
          className="outline-none py-2 px-4 flex-1 bg-secondary1 text-[13px] flex items-center justify-center gap-2 text-white font-medium"
        >
          <FiSearch />
          Tìm kiếm
        </button>
      </div>
      {isShowModal && (
        <Modal
          handleSubmit={handleSubmit}
          queries={queries}
          arrMinMax={arrMinMax}
          content={content}
          name={name}
          setIsShowModal={setIsShowModal}
        />
      )}
    </>
  );
};

export default Search;
