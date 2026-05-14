import React from "react";

const RangeSelector = ({ 
  name, 
  headLeft, 
  headRight, 
  convertTailToHead, 
  handleClickTrack, 
  setHeadLeft, 
  setHeadRight, 
  setActiveEle, 
  activeEle, 
  content, 
  handleActive 
}) => {
  return (
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
  );
};

export default RangeSelector;
