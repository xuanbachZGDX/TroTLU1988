import React, { useState } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";

/**
 * GoogleMap — hiển thị bản đồ nhúng từ địa chỉ văn bản.
 * Dùng Google Maps Embed (không cần API key).
 *
 * Props:
 *  - address: string  — địa chỉ của bài đăng / địa điểm cần hiển thị
 *  - height:  string  — chiều cao iframe, mặc định "320px"
 *  - title:   string  — tiêu đề section, mặc định "Xem trên bản đồ"
 */
const GoogleMap = ({ address, height = "320px", title = "Xem trên bản đồ" }) => {
  const [loaded, setLoaded] = useState(false);

  if (!address) return null;

  // Tạo URL embed — Google tự geocode địa chỉ, không cần API key
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&hl=vi&z=15`;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      {/* Tiêu đề */}
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        <HiOutlineLocationMarker className="text-red-500" size={20} />
        {title}
      </h2>

      {/* Địa chỉ text */}
      <p className="text-sm text-gray-500 mb-3">📍 {address}</p>

      {/* Iframe map */}
      <div
        className="relative w-full rounded-lg overflow-hidden border border-gray-100"
        style={{ height }}
      >
        {/* Skeleton loading */}
        {!loaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
            <span className="text-gray-400 text-sm">Đang tải bản đồ...</span>
          </div>
        )}

        <iframe
          title="google-map"
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* Link mở Google Maps app */}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
      >
        <HiOutlineLocationMarker size={14} />
        Mở trong Google Maps
      </a>
    </div>
  );
};

export default GoogleMap;
