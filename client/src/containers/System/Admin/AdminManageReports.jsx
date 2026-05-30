import React, { useEffect, useState } from "react";
import { apiGetReports, apiHandleReport } from "../../../services/postService";
import Swal from "sweetalert2";
import { RiFlagLine, RiLoader4Line } from "react-icons/ri";
import ReportTabs from "./Report/ReportTabs";
import ReportRow from "./Report/ReportRow";

const AdminManageReports = () => {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [update, setUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const response = await apiGetReports({ page, status: statusFilter });
        if (response?.data.err === 0) {
          setReports(response.data.response.rows);
          setTotalCount(response.data.response.count);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách báo cáo:", error);
      }
      setIsLoading(false);
    };
    fetchReports();
  }, [page, statusFilter, update]);

  const handleAction = async (reportId, action) => {
    const isResolve = action === "resolve";
    const title = isResolve ? "Khóa bài đăng này?" : "Bác bỏ báo cáo vi phạm?";
    const text = isResolve
      ? "Nhập lý do khóa bài để gửi email thông báo chi tiết cho chủ trọ."
      : "Xác nhận báo cáo vi phạm này là không chính xác hoặc không đủ căn cứ.";

    const { value: note } = await Swal.fire({
      title,
      text,
      input: isResolve ? "textarea" : undefined,
      inputPlaceholder: "Ví dụ: Đăng tin giả, sai số điện thoại, giá ảo...",
      showCancelButton: true,
      confirmButtonText: isResolve ? "Khóa & Thông báo" : "Xác nhận bác bỏ",
      cancelButtonText: "Hủy",
      confirmButtonColor: isResolve ? "#f97316" : "#6b7280",
      inputValidator: isResolve
        ? (value) => !value && "Vui lòng nhập lý do khóa bài viết!"
        : undefined,
    });

    if (note !== undefined) {
      try {
        const res = await apiHandleReport({
          reportId,
          action,
          note: note || "",
        });
        if (res?.data?.err === 0) {
          Swal.fire("Thành công", res.data.msg, "success");
          setUpdate((prev) => !prev);
        } else {
          Swal.fire("Thất bại", res?.data?.msg || "Có lỗi xảy ra", "error");
        }
      } catch {
        Swal.fire("Lỗi", "Không thể thực hiện tác vụ này", "error");
      }
    }
  };

  const handleViewDetail = (item) => {
    Swal.fire({
      title: `<div class="text-left font-bold text-lg border-b pb-3 mb-4 text-orange-600 flex items-center gap-2">⚠️ Chi tiết báo cáo vi phạm</div>`,
      html: `
        <div class="text-left">
          <div class="mb-3"><strong>Người báo cáo:</strong> ${item.reporter?.name || "Khách vãng lai"} (${item.reporter?.phone || "N/A"})</div>
          <div class="mb-3"><strong>Loại vi phạm:</strong> <span class="text-red-500 font-bold">${item.reason}</span></div>
          <div class="mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100 italic text-gray-700">"${item.content || "Không có nội dung mô tả"}"</div>
          ${item.note ? `<div class="mb-3"><strong>Phản hồi của Admin:</strong> <span class="text-green-600 font-semibold">${item.note}</span></div>` : ""}
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      customClass: { popup: "rounded-3xl p-6" },
    });
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Danh Sách Báo Cáo Vi Phạm
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Kiểm duyệt và khóa bài đăng bị người dùng báo cáo sai phạm trên hệ
            thống
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <ReportTabs
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          setPage={setPage}
        />

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="w-full py-20 flex justify-center items-center text-orange-500">
              <RiLoader4Line size={48} className="animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Người báo cáo
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Bài viết bị báo cáo
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Lý do & Nội dung
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                    Ngày gửi
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reports.map((item) => (
                  <ReportRow
                    key={item.id}
                    item={item}
                    handleViewDetail={handleViewDetail}
                    handleAction={handleAction}
                  />
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-20 text-center text-gray-400"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <RiFlagLine
                          size={48}
                          className="opacity-20 text-orange-500 animate-bounce"
                        />
                        <span className="font-medium">
                          Tuyệt vời! Không có báo cáo vi phạm nào ở mục này
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManageReports;
