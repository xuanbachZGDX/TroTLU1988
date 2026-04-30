import React, { memo, useState, useRef } from "react";
import SlickSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Nút prev / next tùy chỉnh
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: "absolute",
      left: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
      background: "rgba(0,0,0,0.45)",
      border: "none",
      borderRadius: "50%",
      width: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "#fff",
      fontSize: "18px",
    }}
  >
    &#8592;
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
      background: "rgba(0,0,0,0.45)",
      border: "none",
      borderRadius: "50%",
      width: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "#fff",
      fontSize: "18px",
    }}
  >
    &#8594;
  </button>
);

const Slider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const mainSliderRef = useRef(null);
  const thumbSliderRef = useRef(null);

  // Đảm bảo images luôn là mảng hợp lệ
  const imageList = Array.isArray(images) && images.length > 0 ? images : [];

  if (imageList.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "320px",
          background: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#aaa",
          fontSize: "14px",
          borderRadius: "8px",
        }}
      >
        Chưa có ảnh
      </div>
    );
  }

  // Settings slider chính
  const mainSettings = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    asNavFor: thumbSliderRef.current,
    beforeChange: (_, next) => setCurrentIndex(next),
  };

  // Settings slider thumbnail
  const thumbSettings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: Math.min(imageList.length, 5),
    slidesToScroll: 1,
    arrows: false,
    focusOnSelect: true,
    asNavFor: mainSliderRef.current,
    centerMode: imageList.length > 5,
    centerPadding: "0px",
  };

  return (
    <div style={{ width: "100%", userSelect: "none" }}>
      {/* Ảnh chính */}
      <div style={{ position: "relative", background: "#1a1a1a", borderRadius: "8px", overflow: "hidden" }}>
        <SlickSlider ref={mainSliderRef} {...mainSettings}>
          {imageList.map((img, index) => (
            <div key={index}>
              <img
                src={img}
                alt={`Ảnh ${index + 1}`}
                style={{
                  width: "100%",
                  height: "320px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          ))}
        </SlickSlider>

        {/* Bộ đếm ảnh */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            borderRadius: "12px",
            padding: "2px 10px",
            fontSize: "13px",
          }}
        >
          {currentIndex + 1} / {imageList.length}
        </div>
      </div>

      {/* Thumbnail */}
      {imageList.length > 1 && (
        <div style={{ marginTop: "8px" }}>
          <SlickSlider ref={thumbSliderRef} {...thumbSettings}>
            {imageList.map((img, index) => (
              <div key={index} style={{ padding: "0 3px" }}>
                <img
                  src={img}
                  alt={`Thumb ${index + 1}`}
                  onClick={() => {
                    mainSliderRef.current?.slickGoTo(index);
                    setCurrentIndex(index);
                  }}
                  style={{
                    width: "100%",
                    height: "64px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    cursor: "pointer",
                    border: currentIndex === index ? "2px solid #00a651" : "2px solid transparent",
                    opacity: currentIndex === index ? 1 : 0.65,
                    transition: "all 0.2s",
                  }}
                />
              </div>
            ))}
          </SlickSlider>
        </div>
      )}
    </div>
  );
};

export default memo(Slider);
