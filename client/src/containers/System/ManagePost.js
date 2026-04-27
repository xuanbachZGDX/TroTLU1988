import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actions";
import { formatDateVN } from "../../utils/Common/formatDate";
import { checkStatus } from "../../utils/Common/checkStatus";

const ManagePost = () => {
  const dispatch = useDispatch();
  const { postOfCurrent } = useSelector((state) => state.post);
  useEffect(() => {
    dispatch(actions.getPostsLimitAdmin());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between py-4 border-b border-gray-200">
        <h1 className="text-3xl font-semibold py-4">Quản lý tin đăng</h1>
        <select className="outline-none border p-2 border-gray-200 rounded-md">
          <option value="">Lọc theo trạng thái</option>
        </select>
      </div>
      <table className="w-full table-fixed">
        <thead>
          <tr>
            <th className="border p-2">Mã tin</th>
            <th className="border p-2">Ảnh đại diện</th>
            <th className="border p-2">Tiêu đề</th>
            <th className="border p-2">Giá</th>
            <th className="border p-2">Ngày bắt đầu</th>
            <th className="border p-2">Ngày hết hạn</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {!postOfCurrent || postOfCurrent.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center p-4">Bạn chưa có tin đăng</td>
            </tr>
          ) : (
            postOfCurrent.map((item) => {
              let images = [];
              try {
                images = JSON.parse(item?.images?.image);
              } catch (e) {
                images = [];
              }

              return (
                <tr key={item.id}>
                  <td className="border p-2 text-center">{item?.overview?.code || item?.id?.split("-")[0]}</td>
                  <td className="border p-2 text-center align-middle">
                    <img
                      className="w-12 h-12 object-cover rounded-md inline-block"
                      src={images[0] || ""}
                      alt="avatar-post"
                    />
                  </td>
                  <td className="border p-2">{item?.title}</td>
                  <td className="border p-2 text-center">{item?.attributes?.price}</td>
                  <td className="border p-2 text-center">
                    {formatDateVN(item?.overview?.created || item?.createdAt)}
                  </td>
                  <td className="border p-2 text-center">
                    {formatDateVN(item?.overview?.expired)}
                  </td>
                  <td className="border p-2 text-center">
                    {checkStatus(item?.overview?.expired)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManagePost;
