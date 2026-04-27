import React, { memo } from "react";
import { useSelector } from "react-redux";
import { InputReadOnly, InputFormV2 } from "./index";



const Overview = ({ payload, setPayload, invalidFields, setInvalidFields }) => {
  const { currentData } = useSelector((state) => state.user);

  return (
    <div className="flex flex-col gap-6">
      {/* Card Giá & Diện tích */}
      <div id="thong-tin-mo-ta" className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          <div className="w-1/2">
            <InputFormV2
              value={payload.priceNumber}
              setValue={setPayload}
              small="Nhập đầy đủ số, ví dụ 1 triệu thì nhập là 1000000"
              label={<span>Giá cho thuê <span className="text-red-500">(*)</span></span>}
              unit={<select className="bg-transparent outline-none cursor-pointer"><option value="đồng/tháng">đồng/tháng</option><option value="triệu/tháng">triệu/tháng</option></select>}
              name="priceNumber"
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
          </div>
          <div className="w-1/2">
            <InputFormV2
              value={payload.areaNumber}
              setValue={setPayload}
              label={<span>Diện tích <span className="text-red-500">(*)</span></span>}
              unit="m²"
              name="areaNumber"
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
          </div>
        </div>

      </div>

      {/* Card Tiêu đề & Mô tả */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Tiêu đề & Mô tả</h2>
          <span className="font-medium cursor-pointer">Tạo nội dung với AI</span>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium">Tiêu đề <span className="text-red-500">(*)</span></label>
            <textarea
              id="title"
              rows="3"
              className="w-full rounded-md outline-none border border-gray-300 p-3"
              value={payload.title}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, title: e.target.value }))
              }
              onFocus={() => setInvalidFields && setInvalidFields(prev => prev.filter(i => i.name !== "title"))}
            ></textarea>
            <small className="text-gray-500">(Tối thiểu 30 ký tự, tối đa 100 ký tự)</small>
            {invalidFields?.some(i => i.name === "title") && <small className="text-red-500">{invalidFields.find(i => i.name === "title")?.message}</small>}
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-medium" htmlFor="description">Nội dung mô tả <span className="text-red-500">(*)</span></label>
            <textarea
              id="description"
              rows="8"
              className="w-full rounded-md outline-none border border-gray-300 p-3"
              value={payload.description}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, description: e.target.value }))
              }
              onFocus={() => setInvalidFields && setInvalidFields(prev => prev.filter(i => i.name !== "description"))}
            ></textarea>
            <small className="text-gray-500">(Tối thiểu 50 ký tự, tối đa 5000 ký tự)</small>
            {invalidFields?.some(i => i.name === "description") && <small className="text-red-500">{invalidFields.find(i => i.name === "description")?.message}</small>}
          </div>
        </div>
      </div>

      {/* Card Thông tin liên hệ */}
      <div id="thong-tin-lien-he" className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-medium mb-6">Thông tin liên hệ</h2>
        <div className="flex items-center gap-6">
          <div className="w-1/2">
            <InputReadOnly
              label="Tên liên hệ"
              value={currentData?.name || currentData?.username}
            />
          </div>
          <div className="w-1/2">
            <InputReadOnly label="Điện thoại" value={currentData?.phone || ""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Overview);
