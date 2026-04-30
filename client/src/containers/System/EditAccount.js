import React, { useState, useEffect } from "react";
import { InputReadOnly, InputFormV2, Button, Loading } from "../../components";
import anonAvatar from "../../assets/user.png";
import { useSelector, useDispatch } from "react-redux";
import { apiUploadImages } from "../../services/postService";
import { apiUpdateUser } from "../../services/userService";
import { getCurrent } from "../../store/actions";
import Swal from "sweetalert2";

const EditAccount = () => {
  const { currentData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [payload, setPayload] = useState({
    name: "",
    email: "",
    zalo: "",
    fbUrl: "",
    avatar: "",
  });
  const [invalidFields, setInvalidFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentData) {
      setPayload({
        name: currentData.name || "",
        email: currentData.email || "",
        zalo: currentData.zalo || "",
        fbUrl: currentData.fbUrl || "",
        avatar: currentData.avatar || "",
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
      if (response.status === 200) {
        setPayload((prev) => ({
          ...prev,
          avatar: response.data?.secure_url,
        }));
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    const isChanged = 
      payload.name !== (currentData?.name || "") ||
      payload.email !== (currentData?.email || "") ||
      payload.zalo !== (currentData?.zalo || "") ||
      payload.fbUrl !== (currentData?.fbUrl || "") ||
      payload.avatar !== (currentData?.avatar || "");

    if (!isChanged) {
      Swal.fire("Thông báo", "Bạn chưa thay đổi thông tin nào!", "info");
      return;
    }

    const payloadToSend = { ...payload };
    const response = await apiUpdateUser(payloadToSend);
    if (response?.data?.err === 0) {
      Swal.fire("Thành công", response.data.msg, "success").then(() => {
        dispatch(getCurrent());
      });
    } else {
      Swal.fire("Thất bại", response?.data?.msg || "Có lỗi xảy ra", "error");
    }
  };

  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Đổi mật khẩu',
      html: `
        <div class="flex flex-col gap-4 mt-2 px-2">
          <div class="flex flex-col text-left">
            <label class="font-medium text-sm text-gray-700 mb-1" for="swal-input-new">Mật khẩu mới</label>
            <input id="swal-input-new" type="password" class="border border-gray-300 rounded-md p-3 w-full outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="Nhập mật khẩu mới">
          </div>
          <div class="flex flex-col text-left">
            <label class="font-medium text-sm text-gray-700 mb-1" for="swal-input-confirm">Xác nhận mật khẩu</label>
            <input id="swal-input-confirm" type="password" class="border border-gray-300 rounded-md p-3 w-full outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="Nhập lại mật khẩu mới">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Lưu',
      cancelButtonText: 'Hủy',
      preConfirm: () => {
        const newPassword = document.getElementById('swal-input-new').value;
        const confirmPassword = document.getElementById('swal-input-confirm').value;

        if (!newPassword || !confirmPassword) {
          Swal.showValidationMessage('Vui lòng nhập đầy đủ thông tin!');
          return false;
        }
        if (newPassword.length < 6) {
          Swal.showValidationMessage('Mật khẩu phải có ít nhất 6 ký tự!');
          return false;
        }
        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('Mật khẩu xác nhận không khớp!');
          return false;
        }

        return { newPassword };
      }
    });

    if (formValues?.newPassword) {
      setIsLoading(true);
      const response = await apiUpdateUser({ password: formValues.newPassword });
      setIsLoading(false);
      if (response?.data?.err === 0) {
        Swal.fire('Thành công!', 'Mật khẩu đã được thay đổi.', 'success');
      } else {
        Swal.fire('Thất bại', response?.data?.msg || 'Có lỗi xảy ra', 'error');
      }
    }
  };

  return (
    <div className="flex flex-col items-center pb-16">
      <h1 className="w-full text-start text-3xl font-semibold py-4 border-b border-gray-300">
        Chỉnh sửa thông tin cá nhân
      </h1>
      <div className="w-3/5 py-6 flex flex-col gap-5">
        <div className="flex justify-center mb-6">
          <div className="flex flex-col items-center gap-4">
            {isLoading ? (
              <div className="w-28 h-28 flex items-center justify-center rounded-full border-2 border-gray-200 shadow-md bg-gray-50">
                <Loading />
              </div>
            ) : (
              <img
                src={typeof payload.avatar === 'string' && payload.avatar ? payload.avatar : anonAvatar}
                alt="avatar"
                className="w-28 h-28 object-cover rounded-full border-2 border-gray-200 shadow-md"
              />
            )}
            <label className="cursor-pointer bg-blue-100 text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-200 transition-colors">
              Đổi ảnh đại diện
              <input type="file" className="hidden" onChange={handleUploadFile} disabled={isLoading} />
            </label>
          </div>
        </div>

        <InputReadOnly direction="flex-row items-center" label="Mã thành viên" value={currentData?.id?.match(/\d/g)?.join("")?.slice(0, 6) || ""} />
        <InputReadOnly direction="flex-row items-center" label="Số điện thoại" value={currentData?.phone} />

        <InputFormV2
          name="name"
          setValue={setPayload}
          value={payload.name}
          setInvalidFields={setInvalidFields}
          invalidFields={invalidFields}
          direction="flex-row items-center"
          label="Tên hiển thị"
        />
        <InputFormV2
          name="email"
          setValue={setPayload}
          value={payload.email}
          setInvalidFields={setInvalidFields}
          invalidFields={invalidFields}
          direction="flex-row items-center"
          label="Email"
        />
        <div className="flex flex-row items-center">
          <label className="w-48 flex-none font-medium" htmlFor="password-field">
            Mật khẩu
          </label>
          <div className="flex flex-auto items-center gap-4">
            <input
              id="password-field"
              type="password"
              value="********"
              readOnly
              className="border border-gray-200 rounded-md bg-gray-100 p-2 w-full outline-none cursor-not-allowed"
            />
            <span
              className="text-blue-500 cursor-pointer hover:underline flex-none font-medium"
              onClick={handleChangePassword}
            >
              Đổi mật khẩu
            </span>
          </div>
        </div>
        <InputFormV2
          name="zalo"
          setValue={setPayload}
          value={payload.zalo}
          setInvalidFields={setInvalidFields}
          invalidFields={invalidFields}
          direction="flex-row items-center"
          label="Số điện thoại Zalo"
        />
        <InputFormV2
          name="fbUrl"
          setValue={setPayload}
          value={payload.fbUrl}
          setInvalidFields={setInvalidFields}
          invalidFields={invalidFields}
          direction="flex-row items-center"
          label="Facebook"
        />
        
        <div className="flex justify-center mt-4 mb-10">
          <Button
            text="Lưu thay đổi"
            bgColor="bg-secondary1"
            textColor="text-white"
            px="px-8"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default EditAccount;
