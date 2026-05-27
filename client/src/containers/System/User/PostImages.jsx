import React from "react";
import { Loading } from "../../../components";
import icons from "../../../utils/icons";

const { BsCameraFill, ImBin } = icons;

const PostImages = ({ imagesPreview, setImagesPreview, setPayload, isLoading, handleFiles, invalidFields, setInvalidFields }) => {
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

  React.useEffect(() => {
    if (imagesPreview?.length > 0 && invalidFields?.some((i) => i.name === "images")) {
      setInvalidFields((prev) => prev.filter((i) => i.name !== "images"));
    }
  }, [imagesPreview, invalidFields, setInvalidFields]);

  const errorObj = invalidFields?.find((item) => item.name === "images");

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-medium mb-2">Hình ảnh</h2>
      <p className="text-xs text-gray-500 mb-4">Cung cấp ít nhất 1 hình ảnh thực tế của phòng trọ để khách thuê dễ tiếp cận.</p>
      <div className="w-full">
        <label
          htmlFor="file"
          className={`w-full flex flex-col items-center justify-center border-2 ${
            errorObj ? "border-red-400 bg-red-50 hover:bg-red-100" : "border-blue-400 bg-blue-50 hover:bg-blue-100"
          } h-[200px] border-dashed rounded-md my-4 cursor-pointer gap-4 transition-all`}
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
        {errorObj && (
          <small className="text-red-500 block mt-1 font-medium italic animate-pulse">
            ⚠️ {errorObj.message}
          </small>
        )}
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
