import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actions";
import { formatDateVN } from "../../utils/Common/formatDate";
import { checkStatus } from "../../utils/Common/checkStatus";
import { Button, Update } from "../../components";
import Swal from "sweetalert2";
import { apiDeletePost } from "../../services";

const ManagePost = () => {
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [post, setPost] = useState([]);

  const { postOfCurrent } = useSelector((state) => state.post);
  useEffect(() => {
    if (!isEdit) {
      dispatch(actions.getPostsLimitAdmin());
    }
  }, [dispatch, isEdit, updateData]);

  const handleDeletePost = async (postId) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Sau khi xóa, bạn sẽ không thể khôi phục lại tin đăng này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Đồng ý xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      const response = await apiDeletePost(postId);
      if (response?.data?.err === 0) {
        setUpdateData((prev) => !prev);
        Swal.fire("Đã xóa!", "Tin đăng của bạn đã được xóa.", "success");
      } else {
        Swal.fire({
          icon: "error",
          title: "Xóa tin đăng thất bại",
          text: response?.data?.msg || "Đã xảy ra lỗi khi xóa tin đăng",
        });
      }
    }
  };

  useEffect(() => {
    setPost(postOfCurrent);
  }, [postOfCurrent]);

  const handleFilterStatus = (statusCode) => {
    if (!statusCode) return setPost(postOfCurrent); // Nếu chọn "Tất cả" thì dừng luôn và trả về mảng gốc

    const now = Date.now();
    setPost(postOfCurrent?.filter(item => {
      const isExpired = new Date(item?.overview?.expired || 0).getTime() < now;
      return statusCode === "1" ? !isExpired : isExpired;
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between py-4 border-b border-gray-200">
        <h1 className="text-3xl font-semibold py-4">Quản lý tin đăng</h1>
        <select 
          onChange={e => handleFilterStatus(e.target.value)} 
          className="outline-none border border-gray-300 bg-white text-gray-700 p-2.5 px-4 rounded-lg shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium cursor-pointer"
        >
          <option value="" className="text-gray-700 font-medium">Lọc theo trạng thái</option>
          <option value="1" className="text-green-600 font-medium">Đang hoạt động</option>
          <option value="0" className="text-red-600 font-medium">Đã hết hạn</option>
        </select>
      </div>
      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Mã tin</th>
            <th className="border p-2">Ảnh đại diện</th>
            <th className="border p-2">Tiêu đề</th>
            <th className="border p-2">Giá</th>
            <th className="border p-2">Ngày bắt đầu</th>
            <th className="border p-2">Ngày hết hạn</th>
            <th>Trạng thái</th>
            <th className="border p-2">Tuỳ chọn</th>
          </tr>
        </thead>
        <tbody>
          {!post || post.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center p-4">
                Bạn chưa có tin đăng
              </td>
            </tr>
          ) : (
            post.map((item) => {
              let images = [];
              try {
                images = JSON.parse(item?.images?.image);
              } catch (e) {
                images = [];
              }

              return (
                <tr key={item.id}>
                  <td className="border p-2 text-center">
                    {item?.overview?.code || item?.id?.split("-")[0]}
                  </td>
                  <td className="border p-2 text-center align-middle">
                    <img
                      className="w-12 h-12 object-cover rounded-md inline-block"
                      src={images[0] || ""}
                      alt="avatar-post"
                    />
                  </td>
                  <td className="border p-2">
                    <div className="line-clamp-3 pr-2" title={item?.title}>
                      {item?.title}
                    </div>
                  </td>
                  <td className="border p-2 text-center">
                    {item?.attributes?.price}
                  </td>
                  <td className="border p-2 text-center">
                    {formatDateVN(item?.overview?.created || item?.createdAt)}
                  </td>
                  <td className="border p-2 text-center">
                    {formatDateVN(item?.overview?.expired)}
                  </td>
                  <td className="border p-2 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div>{checkStatus(item?.overview?.expired)}</div>
                      {item?.updatedAt &&
                      item?.createdAt &&
                      new Date(item.updatedAt).getTime() >
                        new Date(item.createdAt).getTime() + 1000 ? (
                        <div className="text-[11px] text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full inline-block">
                          Vừa cập nhật
                        </div>
                      ) : item?.createdAt &&
                        new Date().getTime() -
                          new Date(item.createdAt).getTime() <
                          24 * 60 * 60 * 1000 ? (
                        <div className="text-[11px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                          Mới đăng
                        </div>
                      ) : null}
                    </div>
                  </td>
                  <td className="border p-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        text="Sửa"
                        bgColor="bg-blue-100 hover:bg-blue-200"
                        textColor="text-blue-600 font-medium"
                        px="px-4"
                        onClick={() => {
                          dispatch(actions.editPost(item));
                          setIsEdit(true);
                        }}
                      />
                      <Button
                        text="Xóa"
                        bgColor="bg-red-100 hover:bg-red-200"
                        textColor="text-red-600 font-medium"
                        px="px-4"
                        onClick={() => handleDeletePost(item.id)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {isEdit && <Update setIsEdit={setIsEdit} />}
    </div>
  );
};

export default ManagePost;
