import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import "moment/locale/vi";
import { getPostDetail } from "../../../store/actions/postAction";
import { Slider, GoogleMap } from "../../../components";
import { FaRegUserCircle } from "react-icons/fa";
import SidebarContact from "./SidebarContact";
import PostContent from "./PostContent";

const DetailPost = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { postDetail } = useSelector((state) => state.post);
  const { features: allFeatures } = useSelector((state) => state.app);

  useEffect(() => {
    if (postId) dispatch(getPostDetail(postId));
  }, [postId, dispatch]);

  const getImages = (post) => {
    if (!post?.images) return [];
    if (Array.isArray(post.images)) {
      return post.images.map((img) => img.image).filter(Boolean);
    }
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

  const selectedFeatures = postDetail?.features || [];
  const features = (allFeatures || []).map((f) => ({
    label: f.value,
    active: selectedFeatures.some((sf) => sf.code === f.code),
  }));

  const formatDate = (date) => {
    if (!date) return "---";
    if (typeof date === "string" && date.includes("/")) return date;
    moment.locale("vi");
    return moment(date).format("dddd, HH:mm DD/MM/YYYY");
  };

  const formatJoinDate = (date) => {
    if (!date) return "";
    return moment(date).format("DD/MM/YYYY");
  };

  const getZaloLink = (zalo, phone) => {
    if (!zalo && !phone) return "#";
    const target = zalo || phone;
    if (target?.startsWith("http")) return target;
    return `https://zalo.me/${target.replace(/\D/g, "")}`;
  };

  const getPhoneLink = (phone) => {
    if (!phone) return "#";
    return `tel:${phone.replace(/\D/g, "")}`;
  };

  return (
    <div className="w-full">
      <div className="flex gap-4 mb-4">
        <div className="w-[68%]">
          <Slider images={images} />
        </div>

        <div className="w-[32%]">
          <SidebarContact
            user={postDetail?.user}
            postId={postId}
            getPhoneLink={getPhoneLink}
            getZaloLink={getZaloLink}
            formatJoinDate={formatJoinDate}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-[68%] flex flex-col gap-4">
          <PostContent
            postDetail={postDetail}
            formatDate={formatDate}
            descriptions={descriptions}
            features={features}
          />

          <GoogleMap address={postDetail?.address} />

          {/* Footer Contact Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-bold mb-4">Thông tin liên hệ</h2>
            <div className="flex items-center gap-4">
              {postDetail?.user?.avatar ? (
                <img
                  src={postDetail.user.avatar}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <FaRegUserCircle
                  size={56}
                  className="text-gray-300 flex-none"
                />
              )}
              <div>
                <p className="font-semibold">
                  {postDetail?.user?.name || "---"}
                </p>
                <p className="flex items-center gap-1 text-sm text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                  Đang hoạt động
                </p>
              </div>
              <div className="ml-auto flex gap-3">
                <a
                  href={getPhoneLink(postDetail?.user?.phone)}
                  className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
                >
                  📞 {postDetail?.user?.phone || "---"}
                </a>
                <a
                  href={getZaloLink(
                    postDetail?.user?.zalo,
                    postDetail?.user?.phone,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
                >
                  💬 Nhắn Zalo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPost;
