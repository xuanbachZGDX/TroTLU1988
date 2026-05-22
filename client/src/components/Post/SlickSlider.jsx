import React, { memo, useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  MdZoomIn,
  MdZoomOut,
  MdClose,
  MdRefresh,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";

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
  const [isOpenLightbox, setIsOpenLightbox] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const mainRef = useRef(null);
  const thumbRef = useRef(null);

  // Lắng nghe sự kiện bàn phím khi mở Lightbox
  useEffect(() => {
    if (!isOpenLightbox) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpenLightbox(false);
        setZoomScale(1);
      } else if (e.key === "ArrowLeft") {
        const prevIndex = (current - 1 + images.length) % images.length;
        mainRef.current?.slickGoTo(prevIndex);
        setCurrent(prevIndex);
        setZoomScale(1);
      } else if (e.key === "ArrowRight") {
        const nextIndex = (current + 1) % images.length;
        mainRef.current?.slickGoTo(nextIndex);
        setCurrent(nextIndex);
        setZoomScale(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpenLightbox, current, images.length]);

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
                onClick={() => {
                  if (current === i) {
                    setIsOpenLightbox(true);
                    setZoomScale(1);
                  }
                }}
                style={{
                  width: "100%",
                  height: "260px",
                  objectFit: "cover",
                  display: "block",
                  borderRadius: "8px",
                  opacity: current === i ? 1 : 0.4,
                  transition: "opacity 0.3s",
                  cursor: current === i ? "zoom-in" : "pointer",
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

      {/* ===== Lightbox phóng to/thu nhỏ ảnh ===== */}
      {isOpenLightbox && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex flex-col items-center justify-center select-none animate-fade-in">
          {/* Thanh công cụ phía trên */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-black bg-opacity-50 flex items-center justify-between px-6 text-white z-[10000]">
            <span className="text-sm font-semibold">
              Ảnh {current + 1} / {images.length}
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setZoomScale((prev) => Math.max(0.5, prev - 0.25))}
                className="w-10 h-10 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 flex items-center justify-center text-white transition cursor-pointer border-none outline-none"
                title="Thu nhỏ"
              >
                <MdZoomOut size={22} />
              </button>
              <span className="text-sm min-w-[50px] text-center font-mono">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale((prev) => Math.min(3, prev + 0.25))}
                className="w-10 h-10 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 flex items-center justify-center text-white transition cursor-pointer border-none outline-none"
                title="Phóng to"
              >
                <MdZoomIn size={22} />
              </button>
              <button
                onClick={() => setZoomScale(1)}
                className="w-10 h-10 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 flex items-center justify-center text-white transition cursor-pointer border-none outline-none"
                title="Đặt lại"
              >
                <MdRefresh size={22} />
              </button>
              <button
                onClick={() => {
                  setIsOpenLightbox(false);
                  setZoomScale(1);
                }}
                className="ml-4 w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition cursor-pointer border-none outline-none"
                title="Đóng"
              >
                <MdClose size={22} />
              </button>
            </div>
          </div>

          {/* Vùng hiển thị ảnh */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-10">
            {/* Nút quay lại ảnh trước */}
            <button
              onClick={() => {
                const prevIndex = (current - 1 + images.length) % images.length;
                mainRef.current?.slickGoTo(prevIndex);
                setCurrent(prevIndex);
                setZoomScale(1);
              }}
              className="absolute left-6 w-12 h-12 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 text-white flex items-center justify-center transition cursor-pointer border-none outline-none z-10"
              title="Ảnh trước"
            >
              <MdNavigateBefore size={36} />
            </button>

            {/* Khung ảnh phóng to */}
            <div
              className="transition-transform duration-200 ease-out max-w-full max-h-full flex items-center justify-center"
              style={{ transform: `scale(${zoomScale})` }}
            >
              <img
                src={images[current]}
                alt={`Phóng to ảnh ${current + 1}`}
                className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg shadow-2xl pointer-events-none"
              />
            </div>

            {/* Nút ảnh kế tiếp */}
            <button
              onClick={() => {
                const nextIndex = (current + 1) % images.length;
                mainRef.current?.slickGoTo(nextIndex);
                setCurrent(nextIndex);
                setZoomScale(1);
              }}
              className="absolute right-6 w-12 h-12 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 text-white flex items-center justify-center transition cursor-pointer border-none outline-none z-10"
              title="Ảnh tiếp theo"
            >
              <MdNavigateNext size={36} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(SlickSlider);
