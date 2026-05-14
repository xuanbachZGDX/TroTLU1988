import React from "react";
import { Select, InputReadOnly, GoogleMap } from "../../index";

const AddressView = ({ 
  province, setProvince, provinces, 
  district, setDistrict, districts, 
  ward, setWard, wards, 
  houseNumber, setHouseNumber, 
  fullAddress, mapAddress, 
  invalidFields, setInvalidFields 
}) => {
  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-medium mb-6">Khu vực</h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-1/2">
            <Select
              setInvalidFields={setInvalidFields}
              invalidFields={invalidFields}
              type="province"
              value={province}
              setValue={setProvince}
              label="Tỉnh/Thành phố (*)"
              options={provinces}
            />
          </div>
          <div className="w-1/2">
            <Select
              setInvalidFields={setInvalidFields}
              invalidFields={invalidFields}
              type="district"
              value={district}
              setValue={setDistrict}
              label="Quận/Huyện (*)"
              options={districts}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-1/2">
            <Select
              setInvalidFields={setInvalidFields}
              invalidFields={invalidFields}
              type="ward"
              value={ward}
              setValue={setWard}
              label="Phường/Xã (*)"
              options={wards}
            />
          </div>
          <div className="w-1/2 flex flex-col gap-2">
            <label className="font-medium text-xs uppercase">Số nhà</label>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md w-full outline-none"
              placeholder="Nhập số nhà"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-full">
            <InputReadOnly label="Địa chỉ" value={fullAddress} />
            {invalidFields?.some((i) => i.name === "address") && (
              <small className="text-red-500 block mt-1">
                {invalidFields.find((i) => i.name === "address")?.message}
              </small>
            )}
          </div>
        </div>

        {mapAddress && (
          <GoogleMap
            address={mapAddress}
            title="Xem trước vị trí"
            height="260px"
          />
        )}
      </div>
    </div>
  );
};

export default AddressView;
