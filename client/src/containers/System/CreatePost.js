import React, { useState } from "react";
import { Overview, Address, Loading, Button } from "../../components";
import { apiUploadImages } from "../../services";
import icons from "../../utils/icons";
import { getCodesPrice, getCodesArea } from "../../utils/Common/getCode";
import { useSelector } from "react-redux";

const { BsCameraFill, ImBin } = icons;

const CreatePost = () => {
  const [payload, setPayload] = useState({
    categoryCode: "",
    title: "",
    priceNumber: 0,
    areaNumber: 0,
    images: "",
    address: "",
    priceCode: "",
    areaCode: "",
    description: "",
    target: "",
    province: "",
  });

  const [imagesPreview, setImagesPreview] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const { prices, areas, categories, provinces } = useSelector(
    (state) => state.app,
  );

  const { currentData } = useSelector((state) => state.user);

  const handleFiles = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    const uploadPromises = [];
    const files = e.target.files;
    const formData = new FormData();

    for (let i of files) {
      formData.append("file", i);
      formData.append(
        "upload_preset",
        process.env.REACT_APP_UPLOAD_ASSETS_NAME,
      );

      uploadPromises.push(apiUploadImages(formData));
    }

    const responses = await Promise.all(uploadPromises);
    const images = responses
      .filter((res) => res.status === 200)
      .map((res) => res.data?.secure_url);

    setIsLoading(false);

    setImagesPreview((prev) => [...prev, ...images]);
    setPayload((prev) => ({
      ...prev,
      images: [...JSON.parse(prev.images || "[]"), ...images],
    }));
  };

  const handleDeleteImage = (image) => {
    setImagesPreview((prev) => [
      ...prev,
      prev?.filter((item) => item !== image),
    ]);
    setPayload((prev) => ({
      ...prev,
      images: prev.images?.filter((item) => item !== image),
    }));
  };

  const handleSubmit = () => {
    if (!prices || !areas) return;

    let priceCodeArr = getCodesPrice(
      [+payload.priceNumber, +payload.priceNumber],
      prices,
    );
    let priceCode = priceCodeArr[0]?.code;

    let areaCodeArr = getCodesArea(
      [+payload.areaNumber, +payload.areaNumber],
      areas,
    );
    let areaCode = areaCodeArr[0]?.code;

    let finalPayload = {
      ...payload,
      priceCode,
      areaCode,
      userId: currentData?.id,
      priceNumber: +payload.priceNumber / Math.pow(10, 6),
      target: payload.target || "Tất cả",
      label: `${categories?.find((item) => item.code === payload.categoryCode)?.value || ""} ${payload?.address?.split(",")[0] || ""}`,
    };

    console.log(finalPayload);
  };

  return (
    <div className="px-6">
      <h1 className="text-3xl font-medium py-4 border-b border-gray-200">
        Đăng tin mới
      </h1>
      <div className="flex gap-4">
        <div className="flex flex-col flex-auto gap-8 py-4">
          <Address payload={payload} setPayload={setPayload} />
          <Overview payload={payload} setPayload={setPayload} />
          <div className="w-full mb-6">
            <h2 className="text-xl font-semibold py-4">Hình ảnh</h2>
            <small>Cập nhật hình ảnh cho bài đăng</small>
            <div className="w-full">
              <label
                htmlFor="file"
                className="w-full flex flex-col items-center justify-center border-2 border-gray-400 h-[200px] border-dashed rounded-md my-4 cursor-pointer gap-4"
              >
                {isLoading ? (
                  <Loading />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <BsCameraFill size={80} />
                    Thêm ảnh
                  </div>
                )}
              </label>
              <input
                onChange={handleFiles}
                value=""
                hidden
                type="file"
                id="file"
                multiple
              />
              <div className="w-full">
                <h3 className="font-medium py-4 ">Ảnh đã chọn</h3>
                <div className="flex items-center gap-4">
                  {imagesPreview.map((item) => {
                    return (
                      <div key={item} className="relative w-1/3 h-1/3">
                        <img
                          src={item}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                        <span
                          title="Xoá"
                          className="absolute top-0 right-0 p-2 bg-gray-300 hover:bg-gray-400 rounded-full cursor-pointer"
                          onClick={() => handleDeleteImage(item)}
                        >
                          <ImBin />
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            text="Tạo mới"
            bgColor="bg-green-600"
            textColor="text-white"
          />
          <div className="h-[500px]"></div>
        </div>
        <div className="w-[30%] flex-none">
          Map
          <Loading />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
