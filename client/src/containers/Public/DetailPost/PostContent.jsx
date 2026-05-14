import React from "react";
import { GrStar } from "react-icons/gr";

const InfoRow = ({ label, value }) => (
  <tr className="border-b border-gray-100">
    <td className="py-2 pr-4 text-gray-500 w-[140px]">{label}:</td>
    <td className="py-2 text-gray-800">{value || "---"}</td>
  </tr>
);

const PostContent = ({ postDetail, formatDate, descriptions, features }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        {postDetail?.star && +postDetail.star > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: +postDetail.star || 0 }).map((_, i) => (
              <GrStar key={i} size={14} className="text-yellow-400" />
            ))}
            {(() => {
                const star = +postDetail.star;
                if (star === 5) return <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded ml-1">TIN VIP NỔI BẬT</span>;
                if (star === 4) return <span className="text-xs font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded ml-1">TIN VIP 1</span>;
                if (star === 3) return <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded ml-1">TIN VIP 2</span>;
                if (star === 2) return <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded ml-1">TIN VIP 3</span>;
                return null;
            })()}
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

        <table className="w-full text-sm border-t border-gray-100">
          <tbody>
            <InfoRow label="Khu vực" value={`${postDetail?.district?.value || ""}, ${postDetail?.province?.value || ""}`} />
            <InfoRow label="Địa chỉ" value={postDetail?.address} />
            <InfoRow label="Mã tin" value={postDetail?.overview?.code} />
            <InfoRow label="Loại tin" value={postDetail?.overview?.type} />
            <InfoRow label="Ngày đăng" value={formatDate(postDetail?.overview?.published)} />
            <InfoRow label="Ngày hết hạn" value={formatDate(postDetail?.overview?.expired)} />
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-lg font-bold mb-3">Thông tin mô tả</h2>
        <div className="text-sm text-gray-700 leading-7 whitespace-pre-line">
          {descriptions.length > 0
            ? descriptions.map((line, i) => <p key={i}>{line}</p>)
            : <p className="text-gray-400">Chưa có mô tả</p>
          }
        </div>
      </div>

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
    </div>
  );
};

export default PostContent;
