import React from "react";
import { RiLoader4Line, RiUpload2Line } from "react-icons/ri";

const KycUploadBox = ({ label, imageUrl, isUploading, onChange, type }) => {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-bold text-gray-700 text-sm">
        {label} <span className="text-red-500">*</span>
      </span>
      <div className="border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-2xl h-48 relative overflow-hidden flex flex-col items-center justify-center bg-gray-50/50 transition-all">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={label}
              className="w-full h-full object-cover"
            />
            <label className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg cursor-pointer">
              Thay đổi
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => onChange(e, type)}
              />
            </label>
          </>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer text-gray-400 hover:text-blue-500 transition-colors">
            {isUploading ? (
              <RiLoader4Line size={32} className="animate-spin text-blue-500" />
            ) : (
              <>
                <RiUpload2Line size={32} />
                <span className="text-xs font-semibold">
                  Tải lên {type === "front" ? "mặt trước" : "mặt sau"}
                </span>
              </>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              disabled={isUploading}
              onChange={(e) => onChange(e, type)}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default KycUploadBox;
