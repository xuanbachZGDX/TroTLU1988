import React, { memo, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Nút prev/next custom, đặt đè lên ảnh
const ArrowBtn = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className={`
      absolute top-1/2 -translate-y-1/2 z-10
      ${direction === "prev" ? "left-3" : "right-3"}
      w-9 h-9 rounded-full
      bg-black bg-opacity-40 hover:bg-opacity-70
      text-white text-lg font-bold
      flex items-center justify-center
      transition-all duration-200
      border-none outline-none cursor-pointer
    `}
  >
    {direction === "prev" ? "‹" : "›"}
  </button>
);

const SlickSlider = ({ images = [] }) => {
  const [current, setCurrent] = useState(0);
  const mainRef = useRef(null);
  const thumbRef = useRef(null);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-72 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400 text-sm">
        Chưa có ảnh
      </div>
    );
  }

  const mainSettings = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    centerMode: true,
    centerPadding: "48px", // lộ 48px ảnh 2 bên
    asNavFor: thumbRef.current,
    beforeChange: (_, next) => setCurrent(next),
  };

  const thumbSettings = {
    dots: false,
    infinite: images.length > 5,
    speed: 300,
    slidesToShow: Math.min(images.length, 5),
    slidesToScroll: 1,
    arrows: false,
    focusOnSelect: true,
    asNavFor: mainRef.current,
    swipeToSlide: true,
  };

  return (
    <div className="w-full select-none">
      {/* ===== Slider ảnh chính ===== */}
      <div className="relative bg-black rounded-xl overflow-hidden">
        <Slider ref={mainRef} {...mainSettings}>
          {images.map((img, i) => (
            <div key={i} style={{ padding: "0 4px" }}>
              <img
                src={img}
                alt={`Ảnh ${i + 1}`}
                style={{
                  width: "100%",
                  height: "260px",
                  objectFit: "cover",
                  display: "block",
                  borderRadius: "8px",
                  opacity: current === i ? 1 : 0.4,
                  transition: "opacity 0.3s",
                }}
              />
            </div>
          ))}
        </Slider>

        {/* Nút điều hướng custom */}
        <ArrowBtn direction="prev" onClick={() => mainRef.current?.slickPrev()} />
        <ArrowBtn direction="next" onClick={() => mainRef.current?.slickNext()} />

        {/* Bộ đếm ảnh */}
        <span
          className="absolute bottom-3 right-6 text-white text-xs font-medium px-3 py-1 rounded-full"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          {current + 1} / {images.length}
        </span>
      </div>

      {/* ===== Thumbnail ===== */}
      {images.length > 1 && (
        <div className="mt-2">
          <Slider ref={thumbRef} {...thumbSettings}>
            {images.map((img, i) => (
              <div key={i} style={{ padding: "0 4px" }}>
                <div
                  onClick={() => {
                    mainRef.current?.slickGoTo(i);
                    setCurrent(i);
                  }}
                  className="cursor-pointer rounded-md overflow-hidden transition-all duration-200"
                  style={{
                    border: current === i ? "2px solid #16a34a" : "2px solid transparent",
                    opacity: current === i ? 1 : 0.55,
                  }}
                >
                  <img
                    src={img}
                    alt={`Thumb ${i + 1}`}
                    style={{ width: "100%", height: "52px", objectFit: "cover", display: "block" }}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default memo(SlickSlider);
