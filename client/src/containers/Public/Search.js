import React, { useCallback, useEffect, useState } from "react";
import { SearchItem, Modal } from "../../components";
import icons from "../../utils/icons";
import { useSelector } from "react-redux";
import { useNavigate, createSearchParams, useLocation } from "react-router-dom";
import { path } from "../../utils/constant";

const {
  BsChevronRight,
  HiOutlineLocationMarker,
  TbReportMoney,
  RiCrop2Line,
  MdOutlineHouseSiding,
  FiSearch,
} = icons;

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isShowModal, setIsShowModal] = useState(false);

  const [content, setContent] = useState([]);
  const [name, setName] = useState("");

  const { provinces, areas, prices, categories } = useSelector(
    (state) => state.app,
  );
  const [queries, setQueries] = useState({});
  const [arrMinMax, setArrMinMax] = useState({});
  const [defaultText, setDefaultText] = useState("");

  useEffect(() => {
    if (!location.pathname.includes(path.SEARCH)) {
      setArrMinMax({});
      setQueries({});
    }
  }, [location]);

  const handleShowModal = (content, name, defaultText) => {
    setContent(content);
    setName(name);
    setIsShowModal(true);
    setDefaultText(defaultText);
  };

  const handleSubmit = useCallback((e, query, arrMinMax) => {
    e.stopPropagation();
    setQueries((prev) => ({ ...prev, ...query }));
    setIsShowModal(false);
    arrMinMax && setArrMinMax((prev) => ({ ...prev, ...arrMinMax }));
  }, []);

  const handleSearch = () => {
    const queryCode = Object.entries(queries)
      .filter((item) => item[0].includes("Code"))
      .filter((item) => item[1]);
    let queryCodeObj = {};
    queryCode.forEach((item) => {
      queryCodeObj[item[0]] = item[1];
    });
    const queryText = Object.entries(queries).filter(
      (item) => !item[0].includes("Code"),
    );

    let queryTextObj = {};
    queryText.forEach((item) => {
      queryTextObj[item[0]] = item[1];
    });

    let titleSearch = `${
      queryTextObj.category ? queryTextObj.category : "Cho thuê tất cả"
    } ${queryTextObj.province ? `tỉnh ${queryTextObj.province}` : ""}  ${queryTextObj.price ? `giá ${queryTextObj.price}` : ""} ${queryTextObj.area ? `diện tích ${queryTextObj.area}` : ""}`;

    navigate(
      {
        pathname: `/${path.SEARCH}`,
        search: createSearchParams(queryCodeObj).toString(),
      },
      { state: { titleSearch } },
    );
  };

  return (
    <>
      <div className="p-[10px] w-3/5 my-3 bg-[#febb02] rounded-lg flex-col lg:flex-row flex items-center justify-around gap-2">
        <span
          onClick={() => handleShowModal(categories, "category", "Tìm tất cả")}
          className="flex-1 cursor-pointer"
        >
          <SearchItem
            IconBefore={<MdOutlineHouseSiding />}
            fontWeight
            IconAfter={<BsChevronRight color="rgb(156, 163, 175)" />}
            text={queries.category}
            defaultText={"Tìm tất cả"}
          />
        </span>
        <span
          onClick={() => handleShowModal(provinces, "province", "Toàn quốc")}
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
          onClick={() => handleShowModal(prices, "price", "Chọn giá")}
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
          onClick={() => handleShowModal(areas, "area", "Chọn diện tích")}
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
          defaultText={defaultText}
        />
      )}
    </>
  );
};

export default Search;
