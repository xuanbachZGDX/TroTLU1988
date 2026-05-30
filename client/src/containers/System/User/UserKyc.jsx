import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { apiUploadImages } from "../../../services/postService";
import { apiSubmitKyc } from "../../../services/userService";
import { getCurrent } from "../../../store/actions";
import Swal from "sweetalert2";
import { RiLoader4Line, RiUpload2Line } from "react-icons/ri";
import KycVerified from "./Kyc/KycVerified";
import KycPending from "./Kyc/KycPending";

const UserKyc = () => {
  const { currentData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [cccdNumber, setCccdNumber] = useState("");
  const [cccdFront, setCccdFront] = useState("");
  const [cccdBack, setCccdBack] = useState("");
  const [isUploadingFront, setIsUploadingFront] = useState(false);
  const [isUploadingBack, setIsUploadingBack] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentData) {
      setCccdNumber(currentData.cccdNumber || "");
      setCccdFront(currentData.cccdFront || "");
      setCccdBack(currentData.cccdBack || "");
    }
  }, [currentData]);

  const handleUploadImage = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const isFront = type === "front";
    if (isFront) setIsUploadingFront(true);
    else setIsUploadingBack(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_ASSETS_NAME);

    try {
      const response = await apiUploadImages(formData);
      if (response.status === 200) {
        if (isFront) setCccdFront(response.data?.secure_url);
        else setCccdBack(response.data?.secure_url);
      }
    } catch {
      Swal.fire("Lỗi!", "Tải ảnh lên thất bại.", "error");
    }

    if (isFront) setIsUploadingFront(false);
    else setIsUploadingBack(false);
  };

  const handleSubmit = async () => {
    if (!cccdNumber.trim()) {
      Swal.fire("Lỗi!", "Vui lòng nhập số CCCD/Hộ chiếu.", "error");
      return;
    }
    if (!cccdFront || !cccdBack) {
      Swal.fire(
        "Lỗi!",
        "Vui lòng tải lên đầy đủ hình ảnh mặt trước và mặt sau.",
        "error",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiSubmitKyc({ cccdNumber, cccdFront, cccdBack });
      if (res?.data?.err === 0) {
        Swal.fire("Thành công", res.data.msg, "success").then(() => {
          dispatch(getCurrent());
        });
      } else {
        Swal.fire("Thất bại", res?.data?.msg || "Có lỗi xảy ra", "error");
      }
    } catch {
      Swal.fire("Lỗi", "Gửi yêu cầu xác minh thất bại", "error");
    }
    setIsSubmitting(false);
  };

  const status = currentData?.kycStatus || "unverified";

  if (status === "verified") return <KycVerified currentData={currentData} />;
  if (status === "pending") return <KycPending currentData={currentData} />;

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Xác Minh Danh Tính Chủ Trọ
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Xác minh danh tính giúp tài khoản của bạn uy tín hơn, các bài đăng
            sẽ có tỉ lệ hiển thị cao hơn và được duyệt nhanh hơn.
          </p>
        </div>

        {status === "rejected" && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-2xl">
            <p className="font-bold text-red-800">
              ⚠️ Yêu cầu trước đó bị từ chối
            </p>
            <p className="text-red-700 text-sm mt-1 italic">
              Lý do từ chối: "
              {currentData.kycNote ||
                "Hình ảnh không rõ ràng hoặc sai thông tin."}
              "
            </p>
          </div>
        )}

        <div className="flex flex-col gap-5 mt-4">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-700 text-sm">
              Số CCCD/Hộ chiếu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="border border-gray-200 rounded-xl p-3.5 outline-none focus:border-blue-500 transition-all font-mono"
              placeholder="Nhập số căn cước công dân hoặc hộ chiếu"
              value={cccdNumber}
              onChange={(e) => setCccdNumber(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mt-2">
            {/* Front Image */}
            <div className="flex flex-col gap-3">
              <span className="font-bold text-gray-700 text-sm">
                Mặt trước CCCD <span className="text-red-500">*</span>
              </span>
              <div className="border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-2xl h-48 relative overflow-hidden flex flex-col items-center justify-center bg-gray-50/50 transition-all">
                {cccdFront ? (
                  <>
                    <img
                      src={cccdFront}
                      alt="CCCD Mặt trước"
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg cursor-pointer">
                      Thay đổi
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleUploadImage(e, "front")}
                      />
                    </label>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer text-gray-400 hover:text-blue-500 transition-colors">
                    {isUploadingFront ? (
                      <RiLoader4Line
                        size={32}
                        className="animate-spin text-blue-500"
                      />
                    ) : (
                      <>
                        <RiUpload2Line size={32} />
                        <span className="text-xs font-semibold">
                          Tải lên mặt trước
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      disabled={isUploadingFront}
                      onChange={(e) => handleUploadImage(e, "front")}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Back Image */}
            <div className="flex flex-col gap-3">
              <span className="font-bold text-gray-700 text-sm">
                Mặt sau CCCD <span className="text-red-500">*</span>
              </span>
              <div className="border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-2xl h-48 relative overflow-hidden flex flex-col items-center justify-center bg-gray-50/50 transition-all">
                {cccdBack ? (
                  <>
                    <img
                      src={cccdBack}
                      alt="CCCD Mặt sau"
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg cursor-pointer">
                      Thay đổi
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleUploadImage(e, "back")}
                      />
                    </label>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer text-gray-400 hover:text-blue-500 transition-colors">
                    {isUploadingBack ? (
                      <RiLoader4Line
                        size={32}
                        className="animate-spin text-blue-500"
                      />
                    ) : (
                      <>
                        <RiUpload2Line size={32} />
                        <span className="text-xs font-semibold">
                          Tải lên mặt sau
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      disabled={isUploadingBack}
                      onChange={(e) => handleUploadImage(e, "back")}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isUploadingFront || isUploadingBack}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <RiLoader4Line className="animate-spin" size={20} />
            )}
            <span>
              {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu xác minh"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserKyc;
