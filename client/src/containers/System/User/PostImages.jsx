import React from "react";
import { Loading } from "../../../components";
import icons from "../../../utils/icons";

const { BsCameraFill, ImBin } = icons;

const PostImages = ({ imagesPreview, setImagesPreview, setPayload, isLoading, handleFiles }) => {
  const handleDeleteImage = (image) => {
    setImagesPreview((prev) => prev?.filter((item) => item !== image));
    setPayload((prev) => ({
      ...prev,
      images: (Array.isArray(prev.images)
        ? prev.images
        : JSON.parse(prev.images || "[]")
      ).filter((item) => item !== image),
    }));
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-medium mb-6">Hình ảnh</h2>
      <div className="w-full">
        <label
          htmlFor="file"
          className="w-full flex flex-col items-center justify-center border-2 border-blue-400 h-[200px] border-dashed rounded-md my-4 cursor-pointer gap-4 bg-blue-50 hover:bg-blue-100 transition-all"
        >
          {isLoading ? (
            <Loading />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-700">
              <BsCameraFill size={60} color="#3b82f6" className="mb-2" />
              Tải ảnh từ thiết bị
            </div>
          )}
        </label>
        <input onChange={handleFiles} value="" hidden type="file" id="file" multiple />
        <div className="w-full mt-6">
          <h3 className="font-medium py-4 ">Ảnh đã chọn</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {imagesPreview?.map((item) => (
              <div key={item} className="relative w-full aspect-square">
                <img src={item} alt="Preview" className="w-full h-full object-cover rounded-md border border-gray-100 shadow-sm" />
                <span
                  title="Xoá"
                  className="absolute top-1 right-1 p-1.5 bg-white shadow-md hover:bg-red-50 rounded-md cursor-pointer text-red-500 transition-colors"
                  onClick={() => handleDeleteImage(item)}
                >
                  <ImBin size={16} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostImages;
