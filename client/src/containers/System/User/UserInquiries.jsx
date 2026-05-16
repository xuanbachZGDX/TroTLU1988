import React, { useEffect, useState } from "react";
import { apiGetMyInquiries } from "../../../services/userService";
import moment from "moment";
import { RiMessage2Line } from "react-icons/ri";
import { AiOutlineClockCircle, AiOutlineCheckCircle } from "react-icons/ai";

const UserInquiries = () => {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const fetchInquiries = async () => {
      const response = await apiGetMyInquiries();
      if (response?.data.err === 0) {
        setInquiries(response.data.response);
      }
    };
    fetchInquiries();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 animate-slide-right">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Góp ý của tôi</h1>
        <p className="text-gray-500 text-sm mt-1">Danh sách các yêu cầu hỗ trợ và góp ý bạn đã gửi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inquiries.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <AiOutlineClockCircle />
                    {moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'replied' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                  {item.status === 'replied' ? 'Đã phản hồi' : 'Đang chờ'}
                </span>
              </div>

              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nội dung đã gửi</p>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4">
                    <p className="text-gray-700 leading-relaxed italic whitespace-pre-wrap">"{item.content}"</p>
                </div>

                {item.response ? (
                  <div className="mt-4 border-t border-dashed border-gray-200 pt-4 animate-slide-bottom">
                    <div className="flex items-center gap-2 mb-3 text-green-600">
                        <AiOutlineCheckCircle size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Phản hồi từ Admin</span>
                    </div>
                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                        <p className="text-gray-800 font-medium leading-relaxed">{item.response}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 bg-gray-50/50 p-4 rounded-2xl border border-dashed border-gray-200 text-center">
                    <span className="text-xs text-gray-400 italic font-medium">Đang chờ Admin xem xét và phản hồi...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {inquiries.length === 0 && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
          <RiMessage2Line size={64} className="opacity-20" />
          <div className="text-center">
            <p className="font-bold text-gray-500 text-lg">Bạn chưa gửi góp ý nào</p>
            <p className="text-sm">Mọi ý kiến của bạn đều giúp chúng tôi hoàn thiện hệ thống hơn.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInquiries;
