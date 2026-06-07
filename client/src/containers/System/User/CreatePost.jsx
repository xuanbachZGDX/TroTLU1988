import React, { useState, useEffect, useRef } from "react";
import {
  Overview,
  Address,
  Button,
  InputReadOnly,
  Select,
  PostHistoryModal,
} from "../../../components";
import { useSelector } from "react-redux";
import {
  apiCreatePost,
  apiUpdatePost,
  apiUploadImages,
  apiGetPostHistory,
  apiGetPostLimitAdmin,
} from "../../../services";
import Swal from "sweetalert2";
import validate from "../../../utils/Common/validate";
import PostPackage from "./PostPackage";
import PostImages from "./PostImages";
import FeaturesSection from "./CreatePost/FeaturesSection";
import CreatePostHeader from "./CreatePost/CreatePostHeader";
import { getInitialPayload } from "./CreatePost/CreatePostHelper";

const CreatePost = ({ isEdit, setIsEdit }) => {
  const [step, setStep] = useState(1);
  const hasCheckedLimit = useRef(false);
  const { dataEdit } = useSelector((state) => state.post);
  const {
    categories,
    features: allFeatures,
    prices,
    areas,
  } = useSelector((state) => state.app);
  const { currentData } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("khu-vuc");

  const [payload, setPayload] = useState(() =>
    getInitialPayload(isEdit, dataEdit),
  );

  const [imagesPreview, setImagesPreview] = useState(payload.images);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);

  const [historyData, setHistoryData] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    if (prices.length > 0 && payload.priceNumber) {
      const pNum = +payload.priceNumber / 1000000;
      const pObj = prices.find((p) => pNum >= p.min && pNum < p.max);
      if (pObj && pObj.code !== payload.priceCode)
        setPayload((prev) => ({ ...prev, priceCode: pObj.code }));
    }
  }, [payload.priceNumber, prices]);

  useEffect(() => {
    if (areas.length > 0 && payload.areaNumber) {
      const aNum = +payload.areaNumber;
      const aObj = areas.find((a) => aNum >= a.min && aNum < a.max);
      if (aObj && aObj.code !== payload.areaCode)
        setPayload((prev) => ({ ...prev, areaCode: aObj.code }));
    }
  }, [payload.areaNumber, areas]);

  useEffect(() => {
    const checkPostLimit = async () => {
      if (
        currentData &&
        currentData.kycStatus !== "verified" &&
        !isEdit &&
        !hasCheckedLimit.current
      ) {
        hasCheckedLimit.current = true;
        try {
          const response = await apiGetPostLimitAdmin({ status: "all" });
          if (response?.data?.err === 0) {
            const count = response.data.response?.count || 0;
            if (count >= 3) {
              Swal.fire({
                title: "Yêu cầu xác minh danh tính (KYC)",
                text: "Tài khoản chưa xác minh danh tính chỉ được đăng tối đa 3 bài viết. Vui lòng hoàn tất xác thực danh tính (KYC) để tiếp tục đăng tin không giới hạn.",
                icon: "warning",
                confirmButtonText: "Xác minh ngay",
                showCancelButton: true,
                cancelButtonText: "Quay lại",
                allowOutsideClick: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.href = "/he-thong/xac-minh-tai-khoan";
                } else {
                  window.location.href = "/he-thong/quan-ly-bai-dang";
                }
              });
            }
          }
        } catch (error) {
          console.error("Error checking post limit:", error);
          hasCheckedLimit.current = false;
        }
      }
    };
    checkPostLimit();
  }, [currentData, isEdit]);

  const handleFiles = async (e) => {
    setIsLoading(true);
    let files = Array.from(e.target.files);
    const currentImagesCount = imagesPreview?.length || 0;

    if (currentImagesCount + files.length > 10) {
      Swal.fire(
        "Thông báo",
        "Bạn chỉ được tải lên tối đa 10 hình ảnh cho mỗi tin đăng",
        "warning",
      );
      const allowedCount = 10 - currentImagesCount;
      if (allowedCount <= 0) {
        setIsLoading(false);
        return;
      }
      files = files.slice(0, allowedCount);
    }

    try {
      const promises = files.map((file) => {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", import.meta.env.VITE_UPLOAD_ASSETS_NAME);
        return apiUploadImages(fd);
      });
      const res = await Promise.all(promises);
      const images = res
        .filter((r) => r.status === 200)
        .map((r) => r.data?.secure_url);
      if (images.length > 0) {
        setImagesPreview((prev) => [...prev, ...images]);
        setPayload((prev) => ({
          ...prev,
          images: [...prev.images, ...images],
        }));
      }
    } catch (err) {
      Swal.fire("Lỗi", "Không thể tải ảnh", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const final = {
        ...payload,
        userId: currentData?.id,
        priceNumber: +payload.priceNumber / 1000000,
      };
      const res = isEdit
        ? await apiUpdatePost({ ...final, postId: dataEdit?.id })
        : await apiCreatePost(final);
      if (res?.data?.err === 0) {
        Swal.fire({
          title: isEdit ? "Cập nhật thành công!" : "Đăng tin thành công!",
          text: isEdit
            ? "Tin đăng của bạn đã được cập nhật và gửi duyệt lại thành công. Vui lòng chờ Admin kiểm duyệt trước khi hiển thị công khai."
            : res.data.msg,
          icon: "success",
        }).then(() => (isEdit ? setIsEdit(false) : window.location.reload()));
      } else {
        Swal.fire("Thất bại!", res?.data?.msg || "Có lỗi xảy ra", "error");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Có lỗi xảy ra khi gửi tin đăng. Vui lòng thử lại.";
      Swal.fire("Thất bại!", errorMsg, "error");
    }
  };

  const handleViewHistory = async () => {
    const response = await apiGetPostHistory(dataEdit?.id);
    if (response?.data?.err === 0) {
      setHistoryData(response.data.data || []);
      setShowHistoryModal(true);
    } else {
      Swal.fire(
        "Không tìm thấy",
        "Chưa có lịch sử chỉnh sửa nào cho tin đăng này.",
        "info",
      );
    }
  };

  const handleScrollToSection = (e, id) => {
    e.preventDefault();
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <CreatePostHeader
        step={step}
        setStep={setStep}
        isEdit={isEdit}
        activeTab={activeTab}
        handleScrollToSection={handleScrollToSection}
      />
      <div className="max-w-5xl mx-auto mt-8 px-4 pb-20">
        {isEdit && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 flex justify-between items-center shadow-sm">
            <div>
              <span className="font-bold text-purple-800 text-sm">
                📜 Nhật ký chỉnh sửa tin đăng
              </span>
              <p className="text-[11px] text-purple-600 mt-1">
                Xem chi tiết so sánh các lần thay đổi thông tin trước đây.
              </p>
            </div>
            <button
              type="button"
              onClick={handleViewHistory}
              className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-purple-700 transition-all active:scale-95"
            >
              Xem lịch sử
            </button>
          </div>
        )}

        <div className={step === 1 ? "flex flex-col gap-8" : "hidden"}>
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-medium mb-6">Chuyên mục</h2>
            <div className="w-1/2">
              <Select
                label="Loại chuyên mục (*)"
                options={categories}
                value={payload.categoryCode}
                setValue={setPayload}
                name="categoryCode"
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />
            </div>
          </div>
          <div id="khu-vuc" className="scroll-mt-40">
            <Address
              payload={payload}
              setPayload={setPayload}
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
          </div>
          <div id="thong-tin-mo-ta" className="scroll-mt-40">
            <Overview
              payload={payload}
              setPayload={setPayload}
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
          </div>
          <FeaturesSection
            allFeatures={allFeatures}
            payload={payload}
            setPayload={setPayload}
          />
          <div id="hinh-anh" className="scroll-mt-40">
            <PostImages
              imagesPreview={imagesPreview}
              setImagesPreview={setImagesPreview}
              setPayload={setPayload}
              isLoading={isLoading}
              handleFiles={handleFiles}
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
          </div>
          <div
            id="thong-tin-lien-he"
            className="scroll-mt-40 bg-white rounded-md shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-medium mb-6">Thông tin liên hệ</h2>
            <div className="flex items-center gap-6">
              <div className="w-1/2">
                <InputReadOnly
                  label="Tên liên hệ"
                  value={currentData?.name || currentData?.username}
                />
              </div>
              <div className="w-1/2">
                <InputReadOnly
                  label="Điện thoại"
                  value={currentData?.phone || ""}
                />
              </div>
            </div>
          </div>
          <Button
            onClick={() => {
              if (validate(payload, setInvalidFields).length === 0) {
                if (isEdit) handleSubmit();
                else setStep(2);
              } else {
                Swal.fire(
                  "Thiếu thông tin",
                  "Vui lòng kiểm tra lại",
                  "warning",
                );
              }
            }}
            text={isEdit ? "Cập nhật thay đổi" : "Tiếp tục"}
            bgColor="bg-blue-600"
            textColor="text-white"
            fullWidth
          />
        </div>
        <div className={step === 2 ? "flex flex-col gap-8" : "hidden"}>
          <PostPackage payload={payload} setPayload={setPayload} />
          <Button
            onClick={handleSubmit}
            text="Xác nhận"
            bgColor="bg-green-600"
            textColor="text-white"
            fullWidth
          />
        </div>
      </div>

      <PostHistoryModal
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setHistoryData([]);
        }}
        historyPost={{
          id: dataEdit?.id,
          overview: {
            code:
              dataEdit?.overview?.code ||
              dataEdit?.id?.slice(0, 8).toUpperCase(),
          },
        }}
        historyData={historyData}
        isAdmin={false}
      />
    </div>
  );
};

export default CreatePost;
