import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import * as actions from "../../../store/actions";
import { apiDeleteAdminPost, apiApproveAdminPost, apiRejectAdminPost, apiGetPostHistory } from "../../../services";
import { apiGetPublicDistrict } from "../../../services/appService";
import { PaginationAdmin, PostHistoryModal } from "../../../components";
import AdminPostFilters from "./AdminPostFilters";
import AdminPostRow from "./AdminPostRow";

const AdminManagePosts = () => {
  const dispatch = useDispatch();
  const { posts, postCount } = useSelector((state) => state.admin);
  const { categories, provinces } = useSelector((state) => state.app);
  const [districts, setDistricts] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: "", status: "", categoryCode: "", provinceCode: "", districtCode: "", star: "" });
  const [appliedFilters, setAppliedFilters] = useState({ search: "", status: "", categoryCode: "", provinceCode: "", districtCode: "", star: "" });

  const [historyPost, setHistoryPost] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    if (filters.provinceCode) {
      const fetchDistricts = async () => {
        const response = await apiGetPublicDistrict(filters.provinceCode);
        if (response?.status === 200) {
          setDistricts((response.data.districts || []).map(d => ({ code: d.code, value: d.name })));
        }
      };
      fetchDistricts();
    } else setDistricts([]);
  }, [filters.provinceCode]);

  useEffect(() => {
    dispatch(actions.getAdminPosts({ page, ...appliedFilters }));
  }, [dispatch, page, appliedFilters]);

  const handleDelete = async (postId) => {
    const res = await Swal.fire({
      title: "Xác nhận xóa bài đăng?",
      text: "Bài đăng sẽ bị xóa vĩnh viễn và không thể khôi phục. Bạn có chắc chắn không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa bài đăng",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#ef4444",
    });
    if (res.isConfirmed) {
      const response = await apiDeleteAdminPost(postId);
      if (response?.data?.err === 0) {
        Swal.fire("Xóa thành công!", "Bài đăng đã được xóa khỏi hệ thống.", "success");
        dispatch(actions.getAdminPosts({ page, ...appliedFilters }));
        dispatch(actions.getAdminDashboard());
      } else {
        Swal.fire("Xóa thất bại!", "Có lỗi xảy ra, vui lòng thử lại.", "error");
      }
    }
  };

  const handleApprove = async (postId) => {
    const res = await Swal.fire({
      title: "Duyệt bài đăng này?",
      text: "Sau khi duyệt, bài đăng sẽ hiển thị công khai trên trang web.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Duyệt bài",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#2563eb",
    });
    if (res.isConfirmed) {
      const response = await apiApproveAdminPost(postId);
      if (response?.data?.err === 0) {
        Swal.fire("Duyệt thành công!", "Bài đăng đã được phê duyệt và hiển thị công khai.", "success");
        dispatch(actions.getAdminPosts({ page, ...appliedFilters }));
        dispatch(actions.getAdminDashboard());
      } else {
        Swal.fire("Duyệt thất bại!", "Có lỗi xảy ra, vui lòng thử lại.", "error");
      }
    }
  };

  const handleReject = async (postId) => {
    const res = await Swal.fire({
      title: "Từ chối bài đăng này?",
      input: "text",
      inputLabel: "Nhập lý do từ chối đăng tin:",
      inputPlaceholder: "Ví dụ: Hình ảnh mờ, thông tin sai lệch...",
      inputValidator: (value) => {
        if (!value) {
          return "Bạn phải nhập lý do từ chối!";
        }
      },
      showCancelButton: true,
      confirmButtonText: "Từ chối & Hoàn tiền",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#f97316",
    });
    if (res.isConfirmed && res.value) {
      const reason = res.value;
      const response = await apiRejectAdminPost(postId, reason);
      if (response?.data?.err === 0) {
        Swal.fire("Đã từ chối!", "Bài đăng đã bị từ chối và hoàn trả phí thành công.", "success");
        dispatch(actions.getAdminPosts({ page, ...appliedFilters }));
      } else {
        Swal.fire("Thất bại!", "Có lỗi xảy ra, vui lòng thử lại.", "error");
      }
    }
  };

  const handleViewHistory = async (post) => {
    setHistoryPost(post);
    const response = await apiGetPostHistory(post.id);
    if (response?.data?.err === 0) {
      setHistoryData(response.data.data || []);
      setShowHistoryModal(true);
    } else {
      Swal.fire("Thất bại", response?.data?.msg || "Không thể lấy lịch sử thay đổi", "error");
    }
  };

  const totalPages = Math.max(1, Math.ceil((postCount || 0) / 10));

  return (
    <div className="flex flex-col gap-6 pb-20">
      <h1 className="text-3xl font-semibold">Quản lý tất cả bài đăng</h1>
      <AdminPostFilters filters={filters} setFilters={setFilters} categories={categories} provinces={provinces} districts={districts} handleApplyFilters={() => { setPage(1); setAppliedFilters(filters); }} />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="min-w-[1200px] w-full">
          <thead className="bg-gray-50 text-[11px] font-bold uppercase text-gray-700">
            <tr>
              <th className="px-4 py-4 text-left">Mã</th>
              <th className="px-4 py-4 text-left">Người đăng</th>
              <th className="px-4 py-4 text-left">Bài đăng</th>
              <th className="px-4 py-4 text-left">Giá</th>
              <th className="px-4 py-4 text-left">Loại</th>
              <th className="px-4 py-4 text-left">Ngày đăng</th>
              <th className="px-4 py-4 text-left">Hết hạn</th>
              <th className="px-4 py-4 text-center">Trạng thái</th>
              <th className="px-4 py-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr><td colSpan="9" className="p-10 text-center italic text-gray-500">Trống.</td></tr>
            ) : (
              posts.map(item => (
                <AdminPostRow 
                  key={item.id} 
                  item={item} 
                  handleApprove={handleApprove} 
                  handleReject={handleReject} 
                  handleDelete={handleDelete} 
                  handleViewHistory={handleViewHistory}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm italic">Tổng: {postCount || 0}</p>
        {totalPages > 1 && <PaginationAdmin page={page} setPage={setPage} totalPages={totalPages} />}
      </div>

      <PostHistoryModal 
        isOpen={showHistoryModal} 
        onClose={() => { setShowHistoryModal(false); setHistoryData([]); }} 
        historyPost={historyPost} 
        historyData={historyData} 
        isAdmin={true}
      />
    </div>
  );
};

export default AdminManagePosts;
