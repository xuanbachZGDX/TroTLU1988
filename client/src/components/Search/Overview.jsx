import React, { memo } from "react";
import { useSelector } from "react-redux";
import { InputReadOnly, InputFormV2 } from "../index";

const Overview = ({ payload, setPayload, invalidFields, setInvalidFields }) => {
  const { currentData } = useSelector((state) => state.user);

  return (
    <div className="flex flex-col gap-6">
      {/* Card Giá & Diện tích */}
      <div id="thong-tin-mo-ta" className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-medium mb-6">Thông tin mô tả</h2>
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
              className={`w-full rounded-md outline-none border p-3 transition-colors ${invalidFields?.some(i => i.name === "title") ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              value={payload.title}
              onChange={(e) => {
                const val = e.target.value;
                setPayload((prev) => ({ ...prev, title: val }));
                if (val.length > 0 && val.length < 30) {
                   setInvalidFields(prev => {
                      const filtered = prev.filter(i => i.name !== 'title');
                      return [...filtered, { name: 'title', message: 'Tiêu đề phải có ít nhất 30 ký tự.' }];
                   });
                } else {
                   setInvalidFields(prev => prev.filter(i => i.name !== 'title'));
                }
              }}
            ></textarea>
            <small className="text-gray-500">
              <span className="font-semibold text-gray-700">{payload.title?.length || 0}/100</span> (Tối thiểu 30 ký tự, tối đa 100 ký tự)
            </small>
            {invalidFields?.some(i => i.name === "title") && <small className="text-red-500 font-medium">{invalidFields.find(i => i.name === "title")?.message}</small>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium" htmlFor="description">Nội dung mô tả <span className="text-red-500">(*)</span></label>
            <textarea
              id="description"
              rows="8"
              className={`w-full rounded-md outline-none border p-3 transition-colors ${invalidFields?.some(i => i.name === "description") ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              value={payload.description}
              onChange={(e) => {
                const val = e.target.value;
                setPayload((prev) => ({ ...prev, description: val }));
                if (val.length > 0 && val.length < 50) {
                   setInvalidFields(prev => {
                      const filtered = prev.filter(i => i.name !== 'description');
                      return [...filtered, { name: 'description', message: 'Nội dung mô tả phải có ít nhất 50 ký tự.' }];
                   });
                } else {
                   setInvalidFields(prev => prev.filter(i => i.name !== 'description'));
                }
              }}
            ></textarea>
            <small className="text-gray-500">
               <span className="font-semibold text-gray-700">{payload.description?.length || 0}/5000</span> (Tối thiểu 50 ký tự, tối đa 5000 ký tự)
            </small>
            {invalidFields?.some(i => i.name === "description") && <small className="text-red-500 font-medium">{invalidFields.find(i => i.name === "description")?.message}</small>}
          </div>
        </div>
      </div>

    </div>
  );
};

export default memo(Overview);
