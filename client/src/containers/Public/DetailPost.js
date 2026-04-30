import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import "moment/locale/vi";
import { getPostDetail } from "../../store/actions/postAction";
import { RelatePost, Slider, GoogleMap } from "../../components";
import { FaRegUserCircle } from "react-icons/fa";
import { GrStar } from "react-icons/gr";
import { RiHeartLine } from "react-icons/ri";
import { BsBookmarkStarFill } from "react-icons/bs";

const DetailPost = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { postDetail } = useSelector((state) => state.post);
  const { features: allFeatures } = useSelector((state) => state.app);

  useEffect(() => {
    if (postId) dispatch(getPostDetail(postId));
  }, [postId, dispatch]);

  const getImages = (post) => {
    try {
      return JSON.parse(post?.images?.image) || [];
    } catch {
      return [];
    }
  };

  const getDescription = (post) => {
    try {
      const parsed = JSON.parse(post?.description);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return post?.description ? [post.description] : [];
    }
  };

  const images = postDetail ? getImages(postDetail) : [];
  const descriptions = postDetail ? getDescription(postDetail) : [];

  const getPostFeatures = () => {
    try {
      const raw = postDetail?.attributes?.features;
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const selectedFeatures = getPostFeatures();
  const features = (allFeatures || []).map((label) => ({
    label,
    active: selectedFeatures.includes(label),
  }));

  const formatDate = (date) => {
    if (!date) return "---";
    moment.locale("vi");
    return moment(date).format("dddd, HH:mm DD/MM/YYYY");
  };

  const formatJoinDate = (date) => {
    if (!date) return "";
    return moment(date).format("DD/MM/YYYY");
  };

  return (
    <div className="w-full">
      <div className="flex gap-6 mb-6">
        <div className="w-[65%]">
          <Slider images={images} />
        </div>

        <div className="w-[35%]">
          <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col items-center text-center gap-3">
            {postDetail?.user?.avatar ? (
              <img
                src={postDetail.user.avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <FaRegUserCircle size={72} className="text-gray-300" />
            )}

            <div>
              <p className="font-semibold text-base">{postDetail?.user?.name || "---"}</p>
              <p className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                Đang hoạt động
              </p>
              {postDetail?.user?.createdAt && (
                <p className="text-xs text-gray-400 mt-1">
                  Tham gia từ: {formatJoinDate(postDetail.user.createdAt)}
                </p>
              )}
            </div>

            {/* Badge đối tác */}
            <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
              <BsBookmarkStarFill />
              <span>Đối tác</span>
            </div>

            {/* Nút gọi điện */}
            <a
              href={`tel:${postDetail?.user?.phone}`}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-full text-sm transition flex items-center justify-center gap-2"
            >
              📞 {postDetail?.user?.phone || "---"}
            </a>

            {/* Nút Zalo */}
            <a
              href={`https://zalo.me/${postDetail?.user?.zalo}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-full text-sm transition flex items-center justify-center gap-2"
            >
              💬 Nhắn Zalo
            </a>

            <div className="flex items-center justify-around w-full border-t pt-3 text-gray-500 text-xs">
              <button className="flex items-center gap-1 hover:text-red-500 transition">
                <RiHeartLine /> Lưu tin
              </button>
              <button className="flex items-center gap-1 hover:text-blue-500 transition">
                🔗 Chia sẻ
              </button>
              <button className="flex items-center gap-1 hover:text-orange-500 transition">
                ⚠️ Báo xấu
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === PHẦN DƯỚI: Nội dung chính + Sidebar === */}
      <div className="flex gap-6">
        <div className="w-[65%] flex flex-col gap-4">

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            {postDetail?.star && (
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: +postDetail.star || 0 }).map((_, i) => (
                  <GrStar key={i} size={14} className="text-yellow-400" />
                ))}
                <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded ml-1">
                  TIN VIP NỔI BẬT
                </span>
              </div>
            )}

            <h1 className="text-xl font-bold text-blue-700 mb-3">
              {postDetail?.title || "---"}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="text-green-600 font-semibold text-base">
                {postDetail?.attributes?.price || "---"}
              </span>
              <span>·</span>
              <span>{postDetail?.attributes?.acreage || "---"}</span>
              <span className="ml-auto text-gray-400">
                Cập nhật: {postDetail?.attributes?.published || "---"}
              </span>
            </div>

            {/* Bảng thông tin */}
            <table className="w-full text-sm border-t border-gray-100">
              <tbody>
                <InfoRow label="Quận huyện" value={postDetail?.overview?.area} />
                <InfoRow label="Địa chỉ" value={postDetail?.address} />
                <InfoRow label="Mã tin" value={postDetail?.overview?.code} />
                <InfoRow label="Ngày đăng" value={formatDate(postDetail?.overview?.created)} />
                <InfoRow label="Ngày hết hạn" value={formatDate(postDetail?.overview?.expired)} />
              </tbody>
            </table>
          </div>

          {/* Thông tin mô tả */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-bold mb-3">Thông tin mô tả</h2>
            <div className="text-sm text-gray-700 leading-7 whitespace-pre-line">
              {descriptions.length > 0
                ? descriptions.map((line, i) => <p key={i}>{line}</p>)
                : <p className="text-gray-400">Chưa có mô tả</p>
              }
            </div>
          </div>

          {/* Nổi bật */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-bold mb-4">Nổi bật</h2>
            <div className="grid grid-cols-4 gap-x-4 gap-y-3">
              {features.map((f) => (
                <div key={f.label} className="flex items-center gap-2">
                  {f.active ? (
                    <span className="flex-none w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <svg viewBox="0 0 20 20" fill="white" className="w-3 h-3">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  ) : (
                    <span className="flex-none w-5 h-5 rounded-full border-2 border-gray-300 bg-gray-100" />
                  )}
                  <span className={`text-sm ${f.active ? "text-gray-800" : "text-gray-400"}`}>
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bản đồ */}
          <GoogleMap address={postDetail?.address} />

          {/* Thông tin liên hệ dưới */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-bold mb-4">Thông tin liên hệ</h2>
            <div className="flex items-center gap-4">
              {postDetail?.user?.avatar ? (
                <img src={postDetail.user.avatar} alt="Avatar" className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <FaRegUserCircle size={56} className="text-gray-300 flex-none" />
              )}
              <div>
                <p className="font-semibold">{postDetail?.user?.name || "---"}</p>
                <p className="flex items-center gap-1 text-sm text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                  Đang hoạt động
                </p>
              </div>
              <div className="ml-auto flex gap-3">
                <a
                  href={`tel:${postDetail?.user?.phone}`}
                  className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
                >
                  📞 {postDetail?.user?.phone || "---"}
                </a>
                <a
                  href={`https://zalo.me/${postDetail?.user?.zalo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
                >
                  💬 Nhắn Zalo
                </a>
              </div>
            </div>

            {/* Lưu ý */}
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-gray-600">
              <p className="font-semibold mb-1">Lưu ý:</p>
              <p>
                Chỉ đặt cọc xác định được chủ nhà và có thỏa thuận biên nhận rõ ràng. Kiểm tra mọi
                điều khoản và yêu cầu liệt kê tất cả chi phí hàng tháng vào hợp đồng.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar - 35% */}
        <div className="w-[35%]">
          <RelatePost />
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <tr className="border-b border-gray-100">
    <td className="py-2 pr-4 text-gray-500 w-[140px]">{label}:</td>
    <td className="py-2 text-gray-800">{value || "---"}</td>
  </tr>
);

export default DetailPost;
