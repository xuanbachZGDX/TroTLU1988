import React from "react";
import {
  MdZoomIn,
  MdZoomOut,
  MdClose,
  MdRefresh,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";

const Lightbox = ({
  images,
  current,
  zoomScale,
  setZoomScale,
  setIsOpenLightbox,
  onPrev,
  onNext,
}) => {
  return (
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
          onClick={onPrev}
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
          onClick={onNext}
          className="absolute right-6 w-12 h-12 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 text-white flex items-center justify-center transition cursor-pointer border-none outline-none z-10"
          title="Ảnh tiếp theo"
        >
          <MdNavigateNext size={36} />
        </button>
      </div>
    </div>
  );
};

export default Lightbox;
