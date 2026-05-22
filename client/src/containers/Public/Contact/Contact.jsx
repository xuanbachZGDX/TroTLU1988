import React, { useState } from "react";
import { InputForm, Button } from "../../../components";
import validate from "../../../utils/Common/validate";
import Swal from "sweetalert2";
import { apiPostContact } from "../../../services/appService";
import { useSelector } from "react-redux";

const Contact = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [payload, setPayload] = useState({
    name: "",
    phone: "",
    description: "",
  });
  const [invalidFields, setInvalidFields] = useState([]);

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Yêu cầu đăng nhập",
        text: "Bạn cần đăng nhập tài khoản để có thể gửi thông tin liên hệ trực tuyến.",
      });
      return;
    }

    setInvalidFields([]);
    const invalids = validate(payload, setInvalidFields);

    if (invalids.length === 0) {
      const response = await apiPostContact(payload);
      if (response?.data.err === 0) {
        Swal.fire({
          icon: "success",
          title: "Cảm ơn bạn!",
          text: response?.data.msg,
        });
        setPayload({ name: "", phone: "", description: "" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Thông báo",
          text: "Có lỗi xảy ra, vui lòng thử lại.",
        });
      }
    }
  };
  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-6">Liên hệ với chúng tôi</h1>
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col h-fit gap-4 bg-gradient-to-br from-blue-700 to-cyan-400 rounded-3xl p-4 text-white">
          <h4 className="font-medium">Thông tin liên hệ</h4>
          <span>Cảm ơn vì đã lựa chọn TLU.com!</span>
          <span>Điện thoại: 0981 069 848</span>
          <span>Email: tlu.com@gmail.com</span>
          <span>Website: https://tlu.com/</span>
          <span>Zalo: 0981 069 848</span>
          <span>Địa chỉ: Nghiêm Xuân Yên, Định Công, Hà Nội</span>
        </div>
        <div className="flex-1 bg-white shadow-md rounded-md p-4 mb-6">
          <h4 className="font-medium text-lg mb-4">Liên hệ trực tuyến</h4>
          <div className="flex flex-col gap-4">
            <InputForm
              label="HỌ VÀ TÊN CỦA BẠN"
              value={payload.name}
              setValue={setPayload}
              keyPayload="name"
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
            <InputForm
              label="SỐ ĐIỆN THOẠI"
              value={payload.phone}
              setValue={setPayload}
              keyPayload="phone"
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
            <div>
              <label htmlFor="description" className="text-xs">
                NỘI DUNG MÔ TẢ
              </label>
              <textarea
                className="outline-none bg-[#e8f0fe] p-2 rounded-md w-full"
                id="description"
                cols="30"
                rows="3"
                value={payload.description}
                onChange={(e) =>
                  setPayload((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
              {invalidFields?.some((i) => i.name === "description") && (
                <small className="text-red-500 italic">
                  {invalidFields.find((i) => i.name === "description")?.message}
                </small>
              )}
            </div>
            <Button
              text="Gửi thông tin"
              bgColor="bg-blue-500"
              textColor="text-white"
              fullWidth
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
