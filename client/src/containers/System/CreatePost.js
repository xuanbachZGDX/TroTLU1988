import React, { useState } from "react";
import { Overview, Address, Loading, Button, Select } from "../../components";
import { apiUploadImages } from "../../services";
import icons from "../../utils/icons";
import { getCodesPrice, getCodesArea } from "../../utils/Common/getCode";
import { useSelector } from "react-redux";
import { apiCreatePost, apiUpdatePost } from "../../services";
import Swal from "sweetalert2";
import validate from "../../utils/Common/validate";
import { useDispatch } from "react-redux";
import * as actions from "../../store/actions";

const { BsCameraFill, ImBin } = icons;

const CreatePost = ({ isEdit, setIsEdit }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("khu-vuc");

  const scrollToElement = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const { dataEdit } = useSelector((state) => state.post);
  
  const [payload, setPayload] = useState(() => {
    const activeData = isEdit ? dataEdit : null;
    let desc = activeData?.description || "";
    try {
      const parsed = JSON.parse(desc);
      if (Array.isArray(parsed)) {
        desc = parsed.join("\n");
      } else if (typeof parsed === "string") {
        desc = parsed;
      }
    } catch (e) {}

    const initData = {
      categoryCode: activeData?.categoryCode || "",
      title: activeData?.title || "",
      priceNumber: activeData?.priceNumber * 1000000 || 0,
      areaNumber: activeData?.areaNumber || 0,
      images: activeData?.images?.image ? JSON.parse(activeData?.images?.image) : [],
      address: activeData?.address || "",
      priceCode: activeData?.priceCode || "",
      areaCode: activeData?.areaCode || "",
      description: desc,
      target: activeData?.target || "",
      province: activeData?.province || "",
    };

    return initData;
  });

  const [imagesPreview, setImagesPreview] = useState(() => {
    const activeData = isEdit ? dataEdit : null;
    if (activeData?.images?.image) {
      try {
        return JSON.parse(activeData.images.image);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);

  const { prices, areas, categories } = useSelector((state) => state.app);

  const [invalidFields, setInvalidFields] = useState([]);

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
      images: [
        ...(Array.isArray(prev.images)
          ? prev.images
          : JSON.parse(prev.images || "[]")),
        ...images,
      ],
    }));
  };

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

  const handleSubmit = async () => {
    if (!prices || !areas) return;

    let priceNumberInMillions = +payload.priceNumber / Math.pow(10, 6);
    let priceCodeArr = getCodesPrice(
      [priceNumberInMillions, priceNumberInMillions],
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
      postId: dataEdit?.id,
      attributeId: dataEdit?.attributeId,
      imageId: dataEdit?.imageId,
      overviewId: dataEdit?.overviewId,
      priceCode,
      areaCode,
      userId: currentData?.id,
      priceNumber: +payload.priceNumber / Math.pow(10, 6),
      target: payload.target || "Tất cả",
      label: `${categories?.find((item) => item.code === payload.categoryCode)?.value || ""} ${payload?.address?.split(",")[0] || ""}`,
    };

    const result = validate(finalPayload, setInvalidFields);
    if (result > 0) {
      document.activeElement?.blur();
      Swal.fire(
        "Thông tin không hợp lệ",
        "Vui lòng kiểm tra lại các trường thông tin",
        "warning",
      ).then(() => {
        scrollToElement("khu-vuc");
      });
      return;
    }

    const response = isEdit 
      ? await apiUpdatePost(finalPayload)
      : await apiCreatePost(finalPayload);

    if (response?.data?.err === 0) {
      Swal.fire("Thành công", isEdit ? "Đã cập nhật bài đăng thành công" : "Đã đăng bài thành công", "success").then(() => {
        if (!isEdit) {
          resetPayload();
          setImagesPreview([]);
        } else {
          if (setIsEdit) setIsEdit(false);
        }
      });
    } else {
      Swal.fire(
        "Thất bại",
        response?.data?.msg || "Có lỗi xảy ra, vui lòng thử lại",
        "error",
       );
    }
  };

  const resetPayload = () => {
    setPayload({
            categoryCode: "",
            title: "",
            priceNumber: "",
            areaNumber: "",
            images: [],
            address: "",
            priceCode: "",
            areaCode: "",
            description: "",
            target: "",
            province: "",
          });
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="px-6 py-4 bg-white border-b border-gray-200 relative">
        <h1 className="text-3xl font-semibold py-4">
          {isEdit ? "Cập nhật tin đăng" : "Đăng tin cho thuê"}
        </h1>
        {!isEdit && (
          <div className="flex gap-6 mt-2">
            <span
              onClick={() => scrollToElement("khu-vuc")}
              className={`${activeTab === "khu-vuc" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500"} pb-2 cursor-pointer font-medium`}
            >
              Khu vực
            </span>
            <span
              onClick={() => scrollToElement("thong-tin-mo-ta")}
              className={`${activeTab === "thong-tin-mo-ta" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500"} pb-2 cursor-pointer font-medium`}
            >
              Thông tin mô tả
            </span>
            <span
              onClick={() => scrollToElement("hinh-anh")}
              className={`${activeTab === "hinh-anh" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500"} pb-2 cursor-pointer font-medium`}
            >
              Hình ảnh
            </span>
            <span
              onClick={() => scrollToElement("thong-tin-lien-he")}
              className={`${activeTab === "thong-tin-lien-he" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500"} pb-2 cursor-pointer font-medium`}
            >
              Thông tin liên hệ
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-center px-6 pt-6">
        <div className="flex flex-col w-full max-w-5xl gap-6 pb-20">
          {/* Loại chuyên mục */}
          <div
            id="khu-vuc"
            className="bg-white rounded-md shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-medium mb-6">Loại chuyên mục</h2>
            <div className="w-1/2">
              <Select
                value={payload.categoryCode}
                setValue={setPayload}
                name="categoryCode"
                options={categories}
                label={
                  <span>
                    Loại chuyên mục <span className="text-red-500">(*)</span>
                  </span>
                }
              />
            </div>
          </div>

          <Address
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            payload={payload}
            setPayload={setPayload}
          />

          <Overview
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            payload={payload}
            setPayload={setPayload}
          />

          {/* Đặc điểm nổi bật */}
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-medium mb-6">Đặc điểm nổi bật</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                "Đầy đủ nội thất",
                "Có gác",
                "Có kệ bếp",
                "Có máy lạnh",
                "Có máy giặt",
                "Có tủ lạnh",
                "Có thang máy",
                "Không chung chủ",
                "Giờ giấc tự do",
                "Có bảo vệ 24/24",
                "Có hầm để xe",
              ].map((item, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    defaultChecked={item === "Có bảo vệ 24/24"}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div
            id="hinh-anh"
            className="bg-white rounded-md shadow-sm border border-gray-200 p-6"
          >
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
              <ul className="text-sm text-gray-500 list-disc ml-4 mt-2">
                <li>Tải lên tối đa 20 ảnh trong một bài đăng</li>
                <li>Dung lượng ảnh tối đa 10MB</li>
                <li>Hình ảnh phải liên quan đến phòng trọ, nhà cho thuê</li>
                <li>Không chèn văn bản, số điện thoại lên ảnh</li>
              </ul>
              <input
                onChange={handleFiles}
                value=""
                hidden
                type="file"
                id="file"
                multiple
              />
              <div className="w-full mt-6">
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
            text={isEdit ? "Cập nhật tin đăng" : "Đăng tin"}
            bgColor="bg-green-600"
            textColor="text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
