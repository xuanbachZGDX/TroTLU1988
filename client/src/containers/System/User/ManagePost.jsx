import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as actions from "../../../store/actions";
import { Update } from "../../../components";
import Swal from "sweetalert2";
import { apiDeletePost, apiRestorePost } from "../../../services";
import { apiGetPublicDistrict } from "../../../services/appService";
import UserPostFilters from "./UserPostFilters";
import UserPostRow from "./UserPostRow";
import { path } from "../../../utils/constant";

const ManagePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const { postOfCurrent } = useSelector((state) => state.post);
  const { provinces } = useSelector((state) => state.app);
  const [districts, setDistricts] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "", provinceCode: "", districtCode: "", star: "" });
  const [appliedFilters, setAppliedFilters] = useState({ search: "", status: "", provinceCode: "", districtCode: "", star: "" });

  useEffect(() => {
    dispatch(actions.getPostsLimitAdmin({ ...appliedFilters }));
  }, [dispatch, isEdit, updateData, appliedFilters]);

  useEffect(() => {
    if (filters.provinceCode) {
      const fetchDistricts = async () => {
        const response = await apiGetPublicDistrict(filters.provinceCode);
        if (response?.status === 200) {
          setDistricts((response.data.districts || []).map(d => ({ code: d.code, value: d.name })));
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setFilters(prev => ({ ...prev, districtCode: "" }));
    }
  }, [filters.provinceCode]);

  const handleDeletePost = async (post) => {
    const isPending = post.status === "pending";
    const res = await Swal.fire({
      title: isPending ? "Hủy đăng tin & Hoàn tiền?" : "Xác nhận xóa tin đăng?",
      text: isPending 
        ? "Tin đăng này đang ở trạng thái chờ duyệt. Hủy đăng tin bạn sẽ được HOÀN TRẢ LẠI 100% phí đăng tin vào số dư ví tài khoản."
        : "Tin đăng đã được duyệt và hiển thị. Xóa tin đăng này bạn sẽ KHÔNG được hoàn lại phí.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isPending ? "Hủy tin & Hoàn tiền" : "Xóa tin",
      cancelButtonText: "Hủy bỏ",
      confirmButtonColor: "#ef4444",
    });
    if (res.isConfirmed) {
      const response = await apiDeletePost(post.id);
      if (response?.data?.err === 0) {
        setUpdateData(p => !p);
        Swal.fire("Thành công!", isPending ? "Đã hủy tin và hoàn tiền thành công!" : "Tin đăng đã được xóa.", "success");
      } else {
        Swal.fire("Xóa thất bại!", "Có lỗi xảy ra, vui lòng thử lại.", "error");
      }
    }
  };

  const handleExtendPost = (item) => {
    navigate(`/${path.SYSTEM}/gia-han-tin-dang/${item.id}`);
  };

  const handleRestorePost = async (post) => {
    const res = await Swal.fire({
      title: "Khôi phục tin đăng?",
      text: "Tin đăng này sẽ được khôi phục ra khỏi kho lưu trữ và gửi duyệt lại lên hệ thống.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Khôi phục",
      cancelButtonText: "Hủy bỏ",
      confirmButtonColor: "#8b5cf6",
    });
    if (res.isConfirmed) {
      const response = await apiRestorePost(post.id);
      if (response?.data?.err === 0) {
        setUpdateData(p => !p);
        Swal.fire("Thành công!", "Đã khôi phục tin và gửi duyệt lại thành công!", "success");
      } else {
        Swal.fire("Lỗi!", "Có lỗi xảy ra, vui lòng thử lại.", "error");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold py-4 border-b">Quản lý tin đăng</h1>
      <UserPostFilters filters={filters} setFilters={setFilters} provinces={provinces} districts={districts} handleApplyFilters={() => setAppliedFilters(filters)} />
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="min-w-[1000px] w-full">
          <thead className="bg-gray-50 text-[11px] font-bold uppercase text-gray-700">
            <tr>
              <th className="px-4 py-4 text-left">Mã</th>
              <th className="px-4 py-4 text-left">Ảnh</th>
              <th className="px-4 py-4 text-left">Tiêu đề</th>
              <th className="px-4 py-4 text-left">Gói tin</th>
              <th className="px-4 py-4 text-left">Giá</th>
              <th className="px-4 py-4 text-left">Ngày đăng</th>
              <th className="px-4 py-4 text-left">Hết hạn</th>
              <th className="px-4 py-4 text-center">Trạng thái</th>
              <th className="px-4 py-4 text-center">Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {postOfCurrent?.length === 0 ? (
              <tr><td colSpan="9" className="p-10 text-center italic text-gray-500">Trống.</td></tr>
            ) : (
              postOfCurrent?.map(item => (
                <UserPostRow 
                  key={item.id} 
                  item={item} 
                  handleEdit={(i) => { dispatch(actions.editPost(i)); setIsEdit(true); }} 
                  handleExtend={handleExtendPost} 
                  handleDelete={handleDeletePost} 
                  handleRestore={handleRestorePost}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {isEdit && <Update setIsEdit={setIsEdit} />}
    </div>
  );
};

export default ManagePost;
