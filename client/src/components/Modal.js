import React, { useState, useEffect, memo } from "react";
import icons from "../utils/icons";
import { getNumberPrice, getNumberArea } from "../utils/Common/getNumber";
import { getCodesPrice, getCodesArea } from "../utils/Common/getCode";

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
      onClick={() => {
        setIsShowModal(false);
      }}
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
          <span
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsShowModal(false);
            }}
          >
            <GrLinkPrevious size={24} />
          </span>
        </div>
        {(name === "category" || name === "province") && (
          <div className="p-4 flex flex-col">
            <span className="py-2 flex gap-2 items-center border-b border-gray-200">
              <input
                type="radio"
                name={name}
                id="default"
                value={defaultText || ""}
                checked={!queries[`${name}Code`] ? true : false}
                onChange={(e) =>
                  handleSubmit(e, {
                    [name]: defaultText,
                    [`${name}Code`]: null,
                  })
                }
              />
              <label htmlFor="default">{defaultText}</label>
            </span>
            {content?.map((item) => {
              return (
                <span
                  key={item.code}
                  className="py-2 flex gap-2 items-center border-b border-gray-200"
                >
                  <input
                    type="radio"
                    name={name}
                    id={item.code}
                    value={item.code}
                    checked={
                      item.code === queries[`${name}Code`] ? true : false
                    }
                    onChange={(e) =>
                      handleSubmit(e, {
                        [name]: item.value,
                        [`${name}Code`]: item.code,
                      })
                    }
                  />
                  <label htmlFor={item.code}>{item.value}</label>
                </span>
              );
            })}
          </div>
        )}
        {(name === "price" || name === "area") && (
          <div className="p-8 py-16">
            <div className="flex flex-col items-center justify-center relative">
              <div className="z-30 absolute top-[-56px] font-bold text-2xl text-secondary2">
                {headLeft === 100 && headRight === 100
                  ? `Trên ${convertTailToHead(headLeft)} ${name === "price" ? "triệu" : "m2"}`
                  : `Từ ${headLeft <= headRight ? convertTailToHead(headLeft) : convertTailToHead(headRight)} - ${headRight >= headLeft ? convertTailToHead(headRight) : convertTailToHead(headLeft)} ${name === "price" ? "triệu" : "m2"}`}
              </div>
              <div
                onClick={handleClickTrack}
                id="track"
                className="slider-track h-[6px] bg-gray-200 absolute top-0 bottom-0 w-full rounded-full cursor-pointer"
              ></div>
              <div
                onClick={handleClickTrack}
                id="track-active"
                className="slider-track-active h-[6px] bg-secondary2 absolute top-0 bottom-0 rounded-full cursor-pointer"
              ></div>
              <input
                max="100"
                min="0"
                step="1"
                type="range"
                value={headLeft}
                className="w-full appearance-none pointer-events-none absolute top-0 bottom-0"
                onChange={(e) => {
                  setHeadLeft(+e.target.value);
                  activeEle && setActiveEle("");
                }}
              />
              <input
                max="100"
                min="0"
                step="1"
                type="range"
                value={headRight}
                className="w-full appearance-none pointer-events-none absolute top-0 bottom-0"
                onChange={(e) => {
                  setHeadRight(+e.target.value);
                  activeEle && setActiveEle("");
                }}
              />
              <div className="absolute z-30 top-6 left-0 right-0 flex justify-between items-center">
                <span
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClickTrack(e, 0);
                  }}
                >
                  0
                </span>
                <span
                  className="mr-[-12px] cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClickTrack(e, 100);
                  }}
                >
                  {name === "price"
                    ? "15 triệu"
                    : name === "area"
                      ? "Trên 90m2"
                      : ""}
                </span>
              </div>
            </div>
            <div className="mt-20">
              <h4 className="font-medium text-gray-700 mb-4">Chọn nhanh:</h4>
              <div className="flex gap-3 items-center flex-wrap w-full">
                {content?.map((item) => {
                  return (
                    <button
                      key={item.code}
                      onClick={() => handleActive(item.code, item.value)}
                      className={`px-5 py-2 text-sm rounded-full cursor-pointer transition-all duration-200 ${
                        item.code === activeEle
                          ? "bg-secondary2 text-white shadow-md font-medium"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                      }`}
                    >
                      {item.value}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
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
