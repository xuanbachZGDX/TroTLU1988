import React, { useState, useEffect } from "react";
import icons from "../utils/icons";

const { GrLinkPrevious } = icons;

const Modal = ({ setIsShowModal, content, name }) => {
  const [headLeft, setHeadLeft] = useState(0);
  const [headRight, setHeadRight] = useState(100);
  const [activeEle, setActiveEle] = useState("");

  useEffect(() => {
    const activeTrackEle = document.getElementById("track-active");
    if (headRight < headLeft) {
      activeTrackEle.style.left = `${headRight}%`;
      activeTrackEle.style.right = `${100 - headLeft}%`;
    } else {
      activeTrackEle.style.left = `${headLeft}%`;
      activeTrackEle.style.right = `${100 - headRight}%`;
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

  const handlePrice = (code, value) => {
    setActiveEle(code);
    let arrMaxMin = getNumber(value);

    if (arrMaxMin.length === 1) {
      if (arrMaxMin[0] === 1) {
        setHeadLeft(0);
        setHeadRight(convertHeadToTail(1));
      }
      if (arrMaxMin[0] === 15) {
        setHeadLeft(100);
        setHeadRight(100);
      }
    }
    if (arrMaxMin.length === 2) {
      setHeadLeft(convertHeadToTail(arrMaxMin[0]));
      setHeadRight(convertHeadToTail(arrMaxMin[1]));
    }
  };

  const convertTailToHead = (percent) =>
    (Math.ceil(Math.round(percent * 1.5) / 5) * 5) / 10;

  const convertHeadToTail = (percent) => Math.floor((percent / 15) * 100);

  const getNumber = (string) =>
    string
      .split(" ")
      .map((item) => +item)
      .filter((item) => !item === false);

  const handleSubmit = () => {
    console.log("Start", convertTailToHead(headLeft));
    console.log("End", convertTailToHead(headRight));
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
        className="w-2/5 bg-white rounded-md"
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
                  />
                  <label htmlFor={item.code}>{item.value}</label>
                </span>
              );
            })}
          </div>
        )}
        {(name === "price" || name === "area") && (
          <div className="p-12 py-20">
            <div className="flex flex-col items-center justify-center relative">
              <div className="z-30 absolute top-[-48px] font-bold text-xl text-orange-600">
                {`Từ ${headLeft <= headRight ? convertTailToHead(headLeft) : convertTailToHead(headRight)} -${headRight >= headLeft ? convertTailToHead(headRight) : convertTailToHead(headLeft)} triệu`}
              </div>
              <div
                onClick={handleClickTrack}
                id="track"
                className="slider-track h-[5px] bg-gray-300 absolute top-0 bottom-0 w-full rounded-full"
              ></div>
              <div
                onClick={handleClickTrack}
                id="track-active"
                className="slider-track-active h-[5px] bg-orange-600 absolute top-0 bottom-0 rounded-full"
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
                  15 triệu
                </span>
              </div>
            </div>
            <div className="mt-24">
              <h4 className="font-medium mb-4">Chọn nhanh:</h4>
              <div className="flex gap-2 items-center flex-wrap w-full ">
                {content?.map((item) => {
                  return (
                    <button
                      key={item.code}
                      onClick={() => handlePrice(item.code, item.value)}
                      className={`px-4 py-2 bg-gray-200 rounded-md cursor-pointer ${item.code === activeEle ? "bg-blue-500 text-white" : ""}`}
                    >
                      {item.value}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        <button
          type="button"
          className="w-full bg-orange-400 py-2 font-medium rounded-bl-md rounded-br-md"
          onClick={handleSubmit}
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
};

export default Modal;
