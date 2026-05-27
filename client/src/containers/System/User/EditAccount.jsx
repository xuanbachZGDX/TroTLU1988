import React, { useState, useEffect } from "react";
import { InputReadOnly, InputFormV2, Button } from "../../../components";
import { useSelector, useDispatch } from "react-redux";
import { apiUploadImages } from "../../../services/postService";
import { apiUpdateUser } from "../../../services/userService";
import { getCurrent } from "../../../store/actions";
import Swal from "sweetalert2";
import AccountAvatar from "./EditAccount/AccountAvatar";

const EditAccount = () => {
  const { currentData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [payload, setPayload] = useState({ name: "", email: "", zalo: "", avatar: "", phone: "" });
  const [invalidFields, setInvalidFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentData) {
      setPayload({
        name: currentData.name || "", email: currentData.email || "",
        zalo: currentData.zalo || "", avatar: currentData.avatar || "",
        phone: currentData.phone || "",
      });
    }
  }, [currentData]);

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_ASSETS_NAME);
    try {
      const response = await apiUploadImages(formData);
      if (response.status === 200) setPayload((prev) => ({ ...prev, avatar: response.data?.secure_url }));
    } catch (error) { console.error(error); }
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (payload.email && !emailRegex.test(payload.email)) {
      setInvalidFields([{ name: "email", message: "Email không đúng định dạng" }]);
      Swal.fire("Lỗi!", "Email không đúng định dạng", "error");
      return;
    }

    const isChanged = payload.name !== (currentData?.name || "") || payload.email !== (currentData?.email || "") ||
      payload.zalo !== (currentData?.zalo || "") || payload.avatar !== (currentData?.avatar || "") || payload.phone !== (currentData?.phone || "");

    if (!isChanged) { Swal.fire("Thông báo", "Bạn chưa thay đổi thông tin nào!", "info"); return; }
    const response = await apiUpdateUser({ ...payload });
    if (response?.data?.err === 0) {
      Swal.fire("Thành công", response.data.msg, "success").then(() => dispatch(getCurrent()));
    } else {
      if (response?.data?.msg?.includes("Email không đúng định dạng")) {
        setInvalidFields([{ name: "email", message: "Email không đúng định dạng" }]);
      }
      Swal.fire("Thất bại", response?.data?.msg || "Có lỗi xảy ra", "error");
    }
  };

  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Đổi mật khẩu',
      html: `
        <div class="flex flex-col gap-4 mt-2 px-2 text-left">
          <div><label class="font-medium text-sm text-gray-700" for="swal-input-old">Mật khẩu hiện tại</label><input id="swal-input-old" type="password" class="border border-gray-300 rounded-md p-3 w-full outline-none" placeholder="Nhập mật khẩu hiện tại"></div>
          <div><label class="font-medium text-sm text-gray-700" for="swal-input-new">Mật khẩu mới</label><input id="swal-input-new" type="password" class="border border-gray-300 rounded-md p-3 w-full outline-none" placeholder="Nhập mật khẩu mới"></div>
          <div><label class="font-medium text-sm text-gray-700" for="swal-input-confirm">Xác nhận mật khẩu</label><input id="swal-input-confirm" type="password" class="border border-gray-300 rounded-md p-3 w-full outline-none" placeholder="Nhập lại mật khẩu mới"></div>
          <div class="flex items-center gap-2"><input type="checkbox" id="show-password" class="w-4 h-4"><label for="show-password" class="text-sm text-gray-600">Hiện mật khẩu</label></div>
        </div>
      `,
      didOpen: () => {
        const cb = document.getElementById('show-password'), p0 = document.getElementById('swal-input-old'), p1 = document.getElementById('swal-input-new'), p2 = document.getElementById('swal-input-confirm');
        cb.addEventListener('change', (e) => { const t = e.target.checked ? 'text' : 'password'; p0.type = t; p1.type = t; p2.type = t; });
      },
      showCancelButton: true, confirmButtonText: 'Cập nhật', cancelButtonText: 'Hủy', confirmButtonColor: '#3b82f6',
      preConfirm: () => {
        const p0 = document.getElementById('swal-input-old').value, p1 = document.getElementById('swal-input-new').value, p2 = document.getElementById('swal-input-confirm').value;
        if (!p0 || !p1 || !p2) { Swal.showValidationMessage('Vui lòng nhập đầy đủ!'); return false; }
        if (p1.length < 6) { Swal.showValidationMessage('Mật khẩu mới tối thiểu 6 ký tự!'); return false; }
        if (p1 === p0) { Swal.showValidationMessage('Mật khẩu mới trùng mật khẩu cũ!'); return false; }
        if (p1 !== p2) { Swal.showValidationMessage('Mật khẩu xác nhận không khớp!'); return false; }
        return { oldPassword: p0, newPassword: p1 };
      }
    });
    if (formValues?.newPassword && formValues?.oldPassword) {
      setIsLoading(true);
      const res = await apiUpdateUser({ password: formValues.newPassword, oldPassword: formValues.oldPassword });
      setIsLoading(false);
      if (res?.data?.err === 0) Swal.fire('Thành công!', 'Mật khẩu đã được đổi.', 'success');
      else Swal.fire('Thất bại', res?.data?.msg || 'Có lỗi xảy ra', 'error');
    }
  };

  return (
    <div className="flex flex-col items-center pb-16">
      <h1 className="w-full text-start text-3xl font-semibold py-4 border-b border-gray-300">Chỉnh sửa thông tin</h1>
      <div className="w-3/5 py-6 flex flex-col gap-5">
        <AccountAvatar isLoading={isLoading} avatar={payload.avatar} handleUploadFile={handleUploadFile} />
        <InputReadOnly direction="flex-row items-center" label="Mã thành viên" value={currentData?.id?.match(/\d/g)?.join("")?.slice(0, 6) || ""} />
        {currentData?.phone ? <InputReadOnly direction="flex-row items-center" label="Số điện thoại" value={currentData?.phone} /> : 
          <InputFormV2 name="phone" setValue={setPayload} value={payload.phone} setInvalidFields={setInvalidFields} invalidFields={invalidFields} direction="flex-row items-center" label="Số điện thoại" />}
        <InputFormV2 name="name" setValue={setPayload} value={payload.name} setInvalidFields={setInvalidFields} invalidFields={invalidFields} direction="flex-row items-center" label="Tên hiển thị" />
        <InputFormV2 name="email" setValue={setPayload} value={payload.email} setInvalidFields={setInvalidFields} invalidFields={invalidFields} direction="flex-row items-center" label="Email" />
        <div className="flex flex-row items-center">
          <label className="w-48 flex-none font-medium">Mật khẩu</label>
          <div className="flex flex-auto items-center justify-between bg-gray-50 p-2 rounded-md border border-gray-200">
            <span className="text-gray-400 font-mono tracking-widest ml-2">••••••••</span>
            <button type="button" className="text-blue-600 font-medium text-sm px-3 py-1 bg-white border border-blue-200 rounded" onClick={handleChangePassword}>Thay đổi mật khẩu</button>
          </div>
        </div>
        <InputFormV2 name="zalo" setValue={setPayload} value={payload.zalo} setInvalidFields={setInvalidFields} invalidFields={invalidFields} direction="flex-row items-center" label="Số điện thoại Zalo" />
        <div className="flex justify-center mt-4"><Button text="Lưu thay đổi" bgColor="bg-secondary1" textColor="text-white" px="px-8" onClick={handleSubmit} /></div>
      </div>
    </div>
  );
};

export default EditAccount;
