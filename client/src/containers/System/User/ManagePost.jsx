import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../store/actions";
import { Update } from "../../../components";
import Swal from "sweetalert2";
import { apiDeletePost, apiExtendPost } from "../../../services";
import { apiGetPublicDistrict } from "../../../services/appService";
import UserPostFilters from "./UserPostFilters";
import UserPostRow from "./UserPostRow";

const ManagePost = () => {
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const { postOfCurrent } = useSelector((state) => state.post);
  const { provinces } = useSelector((state) => state.app);
  const [districts, setDistricts] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "", provinceCode: "", districtCode: "" });
  const [appliedFilters, setAppliedFilters] = useState({ search: "", status: "", provinceCode: "", districtCode: "" });

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

  const handleDeletePost = async (postId) => {
    const res = await Swal.fire({
      title: "Xác nhận xóa tin đăng?",
      text: "Tin đăng sẽ bị xóa vĩnh viễn. Phí đăng tin sẽ không được hoàn lại.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa tin",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#ef4444",
    });
    if (res.isConfirmed) {
      const response = await apiDeletePost(postId);
      if (response?.data?.err === 0) {
        setUpdateData(p => !p);
        Swal.fire("Xóa thành công!", "Tin đăng của bạn đã được xóa khỏi hệ thống.", "success");
      } else {
        Swal.fire("Xóa thất bại!", "Có lỗi xảy ra, vui lòng thử lại.", "error");
      }
    }
  };

  const handleExtendPost = async (postId) => {
    const res = await Swal.fire({
      title: "Gia hạn tin đăng?",
      text: "Tin đăng sẽ được gia hạn thêm 7 ngày. Phí gia hạn là 10.000đ sẽ trừ trực tiếp từ số dư tài khoản.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Gia hạn ngay",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#2563eb",
    });
    if (res.isConfirmed) {
      const response = await apiExtendPost(postId);
      if (response?.data?.err === 0) {
        setUpdateData(p => !p);
        Swal.fire("Gia hạn thành công!", "Tin đăng của bạn đã được gia hạn thêm 7 ngày.", "success");
      } else {
        Swal.fire("Gia hạn thất bại!", response?.data?.msg || "Số dư không đủ hoặc có lỗi xảy ra.", "error");
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
              <th className="px-4 py-4 text-left">Giá</th>
              <th className="px-4 py-4 text-left">Ngày đăng</th>
              <th className="px-4 py-4 text-left">Hết hạn</th>
              <th className="px-4 py-4 text-center">Trạng thái</th>
              <th className="px-4 py-4 text-center">Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {postOfCurrent?.length === 0 ? <tr><td colSpan="8" className="p-10 text-center italic text-gray-500">Trống.</td></tr> : postOfCurrent?.map(item => <UserPostRow key={item.id} item={item} handleEdit={(i) => { dispatch(actions.editPost(i)); setIsEdit(true); }} handleExtend={handleExtendPost} handleDelete={handleDeletePost} />)}
          </tbody>
        </table>
      </div>
      {isEdit && <Update setIsEdit={setIsEdit} />}
    </div>
  );
};

export default ManagePost;
