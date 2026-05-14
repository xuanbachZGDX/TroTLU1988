import React, { useState, useEffect, memo } from "react";
import icons from "../../utils/icons";
import { getNumberPrice, getNumberArea } from "../../utils/Common/getNumber";
import { getCodesPrice, getCodesArea } from "../../utils/Common/getCode";
import ListSelector from "./Modal/ListSelector";
import RangeSelector from "./Modal/RangeSelector";

const { GrLinkPrevious } = icons;

const Modal = ({
  setIsShowModal,
  content,
  name,
  handleSubmit,
  queries,
  arrMinMax,
  defaultText,
}) => {
  const [headLeft, setHeadLeft] = useState(
    name === "price" && arrMinMax?.priceArr
      ? (arrMinMax?.priceArr?.[0] ?? 0)
      : name === "area" && arrMinMax?.areaArr
        ? (arrMinMax?.areaArr?.[0] ?? 0)
        : 0,
  );
  const [headRight, setHeadRight] = useState(
    name === "price" && arrMinMax?.priceArr
      ? (arrMinMax?.priceArr?.[1] ?? 100)
      : name === "area" && arrMinMax?.areaArr
        ? (arrMinMax?.areaArr?.[1] ?? 100)
        : 100,
  );
  const [activeEle, setActiveEle] = useState("");

  useEffect(() => {
    const activeTrackEle = document.getElementById("track-active");
    if (activeTrackEle) {
      if (headRight < headLeft) {
        activeTrackEle.style.left = `${headRight}%`;
        activeTrackEle.style.right = `${100 - headLeft}%`;
      } else {
        activeTrackEle.style.left = `${headLeft}%`;
        activeTrackEle.style.right = `${100 - headRight}%`;
      }
    }
  }, [headLeft, headRight]);

  const handleClickTrack = (e, value) => {
    const stackEle = document.getElementById("track");
    const stackRect = stackEle.getBoundingClientRect();
    let percent = value
      ? value
      : Math.round(((e.clientX - stackRect.left) * 100) / stackRect.width);
    if (Math.abs(percent - headLeft) <= Math.abs(percent - headRight)) {
      setHeadLeft(percent);
    } else {
      setHeadRight(percent);
    }
  };

  const handleActive = (code, value) => {
    setActiveEle(code);
    let arrMaxMin =
      name === "price" ? getNumberPrice(value) : getNumberArea(value);

    if (arrMaxMin.length === 1) {
      if (arrMaxMin[0] === 1) {
        setHeadLeft(0);
        setHeadRight(convertHeadToTail(1));
      }
      if (arrMaxMin[0] === 20) {
        setHeadLeft(0);
        setHeadRight(convertHeadToTail(20));
      }
      if (arrMaxMin[0] === 15 || arrMaxMin[0] === 90) {
        setHeadLeft(100);
        setHeadRight(100);
      }
    }
    if (arrMaxMin.length === 2) {
      setHeadLeft(convertHeadToTail(arrMaxMin[0]));
      setHeadRight(convertHeadToTail(arrMaxMin[1]));
    }
  };

  const convertTailToHead = (percent) => {
    return name === "price"
      ? (Math.ceil(Math.round(percent * 1.5) / 5) * 5) / 10
      : name === "area"
        ? Math.ceil(Math.round(percent * 0.9) / 5) * 5
        : 0;
  };

  const convertHeadToTail = (percent) => {
    let target = name === "price" ? 15 : name === "area" ? 90 : 1;
    return Math.floor((percent / target) * 100);
  };

  const handleBeforeSubmit = (e) => {
    let min = headLeft <= headRight ? headLeft : headRight;
    let max = headLeft <= headRight ? headRight : headLeft;
    let arrMinMaxFormatted = [convertTailToHead(min), convertTailToHead(max)];
    const gaps =
      name === "price"
        ? getCodesPrice(arrMinMaxFormatted, content)
        : name === "area"
          ? getCodesArea(arrMinMaxFormatted, content)
          : [];

    const queryRange =
      min === 100 && max === 100
        ? [arrMinMaxFormatted[0], name === "price" ? 999 : 9999]
        : arrMinMaxFormatted;

    handleSubmit(
      e,
      {
        [`${name}Code`]: gaps?.map((item) => item.code),
        [`${name}Number`]: queryRange,
        [name]:
          min === 100 && max === 100
            ? `Trên ${arrMinMaxFormatted[0]} ${name === "price" ? "triệu" : "m2"}`
            : `Từ ${arrMinMaxFormatted[0]} - ${arrMinMaxFormatted[1]} ${
                name === "price" ? "triệu" : "m2"
              }`,
      },
      {
        [`${name}Arr`]: [min, max],
      },
    );
  };

  return (
    <div
      onClick={() => setIsShowModal(false)}
      className="fixed top-0 left-0 right-0 bottom-0 bg-overlay-70 z-20 flex items-center justify-center"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsShowModal(true);
        }}
        className="w-2/5 h-[500px] bg-white rounded-md relative"
      >
        <div className="h-[45px] flex items-center px-4 border-b border-gray-200">
          <span className="cursor-pointer" onClick={(e) => {
            e.stopPropagation();
            setIsShowModal(false);
          }}>
            <GrLinkPrevious size={24} />
          </span>
        </div>

        {(name === "category" || name === "province") && (
          <ListSelector 
            name={name}
            defaultText={defaultText}
            queries={queries}
            content={content}
            handleSubmit={handleSubmit}
          />
        )}

        {(name === "price" || name === "area") && (
          <RangeSelector 
            name={name}
            headLeft={headLeft}
            headRight={headRight}
            convertTailToHead={convertTailToHead}
            handleClickTrack={handleClickTrack}
            setHeadLeft={setHeadLeft}
            setHeadRight={setHeadRight}
            setActiveEle={setActiveEle}
            activeEle={activeEle}
            content={content}
            handleActive={handleActive}
          />
        )}

        {(name === "price" || name === "area") && (
          <button
            type="button"
            className="w-full absolute bottom-0 bg-secondary1 py-3 text-white font-semibold rounded-bl-md rounded-br-md hover:bg-[#0f54b8] transition-colors uppercase tracking-widest shadow-inner"
            onClick={handleBeforeSubmit}
          >
            ÁP DỤNG
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(Modal);
