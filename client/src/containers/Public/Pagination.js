import React, { useEffect, useState } from "react";
import { PageNumber } from "../../components";
import { useSelector } from "react-redux";
import icons from "../../utils/icons";
import { useSearchParams } from "react-router-dom";

const { GrLinkNext } = icons;

const Pagination = () => {
  const { count, posts } = useSelector((state) => state.post);
  const [arrPage, setArrPage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isHideEnd, setIsHideEnd] = useState(false);
  const [isHideStart, setIsHideStart] = useState(false);
  const [searchParams] = useSearchParams();
  const limit = Number(import.meta.env.VITE_LIMIT_POSTS || 10);
  const maxPage = Math.ceil(count / limit);

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    setCurrentPage(page > maxPage && maxPage > 0 ? maxPage : page);
  }, [maxPage, searchParams]);

  useEffect(() => {
    if (!maxPage) {
      setArrPage([]);
      return;
    }
    let start = currentPage - 1 <= 0 ? 1 : currentPage - 1;
    let end = start + 2 > maxPage ? maxPage : start + 2;
    if (end === maxPage && maxPage > 3) {
      start = maxPage - 2;
    }

    let temp = [];
    for (let i = start; i <= end; i++) {
      temp.push(i);
    }
    setArrPage(temp);
    currentPage >= maxPage - 1 ? setIsHideEnd(true) : setIsHideEnd(false);
    currentPage <= 2 ? setIsHideStart(true) : setIsHideStart(false);
  }, [posts, currentPage, maxPage]);

  if (count <= limit) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-5">
      {!isHideStart && <PageNumber setCurrentPage={setCurrentPage} text={1} />}
      {!isHideStart && currentPage > 3 && <PageNumber text={"..."} />}
      {arrPage.length > 0 &&
        arrPage.map((item) => {
          return (
            <PageNumber
              key={item}
              text={item}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          );
        })}
      {!isHideEnd && currentPage < maxPage - 1 && <PageNumber text={"..."} />}
      {!isHideEnd && (
        <PageNumber
          icon={<GrLinkNext />}
          setCurrentPage={setCurrentPage}
          text={maxPage}
        />
      )}
    </div>
  );
};

export default Pagination;
