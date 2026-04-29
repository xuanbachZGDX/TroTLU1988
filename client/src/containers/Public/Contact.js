import React, { useState } from "react";
import { InputForm, Button } from "../../components";
import validate from "../../utils/Common/validate";
import Swal from "sweetalert2";

const Contact = () => {
  const [payload, setPayload] = useState({
    name: "",
    phone: "",
    description: "",
  });
  const [invalidFields, setInvalidFields] = useState([]);

  const handleSubmit = () => {
    setInvalidFields([]);
    const invalids = validate(payload, setInvalidFields);

    if (invalids === 0) {
      Swal.fire({
        icon: "success",
        title: "Cảm ơn bạn!",
        text: "Chúng tôi sẽ liên hệ lại.",
      });
      setPayload({ name: "", phone: "", description: "" });
    }
  };
  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-6">Liên hệ với chúng tôi</h1>
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col h-fit gap-4 bg-gradient-to-br from-blue-700 to-cyan-400 rounded-3xl p-4 text-white">
          <h4 className="font-medium">Thông tin liên hệ</h4>
          <span>Cảm ơn vì đã lựa chọn phongtro123.com!</span>
          <span>Điện thoại: 0981 069 848</span>
          <span>Email: phongtro123@gmail.com</span>
          <span>Website: https://phongtro123.com/</span>
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
