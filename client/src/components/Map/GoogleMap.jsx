import React, { useState } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";

const GoogleMap = ({
  address,
  height = "320px",
  title = "Xem trước vị trí",
}) => {
  const [loaded, setLoaded] = useState(false);

  if (!address) return null;

  // Keep the map a bit wider so nearby roads and landmarks remain visible.
  const embedUrl = `https://www.google.com/maps?output=embed&q=${encodeURIComponent(address)}&hl=vi&z=14&t=m`;
  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&travelmode=driving`;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
        <HiOutlineLocationMarker className="text-red-500" size={20} />
        {title}
      </h2>

      <p className="mb-3 text-sm text-gray-500">📍 {address}</p>

      <div
        className="relative w-full overflow-hidden rounded-lg border border-gray-100"
        style={{ height }}
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
            <span className="text-sm text-gray-400">Đang tải bản đồ...</span>
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

      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
        <a
          href={searchUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 transition-colors hover:text-blue-800 hover:underline"
        >
          <HiOutlineLocationMarker size={14} />
          Mở trong Google Maps
        </a>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 transition-colors hover:text-blue-800 hover:underline"
        >
          <HiOutlineLocationMarker size={14} />
          Chỉ đường đến đây
        </a>
      </div>
    </div>
  );
};

export default GoogleMap;
