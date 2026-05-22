import React from "react";

const PostHistoryModal = ({ isOpen, onClose, historyPost, historyData, isAdmin = false }) => {
  if (!isOpen) return null;

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "N/A";
    const num = +price;
    if (num >= 1) return `${num.toFixed(2).replace(/\.00$/, '')} triệu/tháng`;
    return `${(num * 1000000).toLocaleString('vi-VN')} đ/tháng`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Lịch sử chỉnh sửa tin đăng {isAdmin ? "(Admin View)" : ""}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Mã tin: <span className="font-mono">{historyPost?.overview?.code || historyPost?.id}</span>
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {historyData.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center gap-3">
              <span className="text-4xl">🗒️</span>
              <p className="text-gray-500 font-medium text-sm">Chưa có lịch sử thay đổi thông tin cho tin đăng này.</p>
              <p className="text-xs text-gray-400">Tin đăng này chưa từng được chỉnh sửa từ lúc tạo.</p>
            </div>
          ) : (
            historyData.map((h, idx) => (
              <div key={h.id} className="border border-purple-100 rounded-xl bg-purple-50/10 p-5 flex flex-col gap-4">
                {/* Tag thứ tự và thời gian */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-600 text-white font-bold text-xs w-6 h-6 flex items-center justify-center rounded-full">
                      {historyData.length - idx}
                    </span>
                    <span className="font-bold text-gray-800 text-sm">
                      Chỉnh sửa lúc {new Date(h.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(h.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Người thực hiện: <span className="font-semibold text-purple-700">{h.editor?.name || "Chủ trọ"}</span> ({h.editor?.phone || "N/A"})
                  </div>
                </div>

                {/* Danh sách thay đổi thực tế */}
                <div className="flex flex-col gap-3">
                  {h.oldTitle !== h.newTitle && (
                    <div className="text-xs grid grid-cols-1 md:grid-cols-12 gap-2 border-b border-gray-50 pb-2">
                      <span className="md:col-span-2 font-bold text-gray-600">Tiêu đề:</span>
                      <div className="md:col-span-10 flex flex-col gap-1">
                        <span className="text-red-600 line-through bg-red-50 px-2 py-0.5 rounded block">{h.oldTitle}</span>
                        <span className="text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded block">{h.newTitle}</span>
                      </div>
                    </div>
                  )}

                  {h.oldPrice !== h.newPrice && (
                    <div className="text-xs grid grid-cols-1 md:grid-cols-12 gap-2 border-b border-gray-50 pb-2">
                      <span className="md:col-span-2 font-bold text-gray-600">Giá phòng:</span>
                      <div className="md:col-span-10 flex items-center gap-4">
                        <span className="text-red-600 line-through bg-red-50 px-2 py-0.5 rounded">{formatPrice(h.oldPrice)}</span>
                        <span className="text-gray-400">➔</span>
                        <span className="text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded">{formatPrice(h.newPrice)}</span>
                      </div>
                    </div>
                  )}

                  {h.oldArea !== h.newArea && (
                    <div className="text-xs grid grid-cols-1 md:grid-cols-12 gap-2 border-b border-gray-50 pb-2">
                      <span className="md:col-span-2 font-bold text-gray-600">Diện tích:</span>
                      <div className="md:col-span-10 flex items-center gap-4">
                        <span className="text-red-600 line-through bg-red-50 px-2 py-0.5 rounded">{h.oldArea} m²</span>
                        <span className="text-gray-400">➔</span>
                        <span className="text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded">{h.newArea} m²</span>
                      </div>
                    </div>
                  )}

                  {h.oldAddress !== h.newAddress && (
                    <div className="text-xs grid grid-cols-1 md:grid-cols-12 gap-2 border-b border-gray-50 pb-2">
                      <span className="md:col-span-2 font-bold text-gray-600">Địa chỉ:</span>
                      <div className="md:col-span-10 flex flex-col gap-1">
                        <span className="text-red-600 line-through bg-red-50 px-2 py-0.5 rounded block">{h.oldAddress}</span>
                        <span className="text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded block">{h.newAddress}</span>
                      </div>
                    </div>
                  )}

                  {h.oldDescription !== h.newDescription && (
                    <div className="text-xs grid grid-cols-1 md:grid-cols-12 gap-2 pb-1">
                      <span className="md:col-span-2 font-bold text-gray-600">Mô tả:</span>
                      <div className="md:col-span-10 flex flex-col gap-2 max-h-[150px] overflow-y-auto border rounded p-2 bg-gray-50">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-red-500 font-medium">[Nội dung cũ]:</span>
                          <p className="text-gray-500 whitespace-pre-wrap">{h.oldDescription}</p>
                        </div>
                        <div className="flex flex-col gap-1 border-t pt-2">
                          <span className="text-xs text-green-600 font-semibold">[Nội dung mới]:</span>
                          <p className="text-gray-800 font-medium whitespace-pre-wrap">{h.newDescription}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end rounded-b-2xl">
          <button 
            onClick={onClose} 
            className="bg-gray-800 text-white font-bold text-sm px-6 py-2 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostHistoryModal;
