import React, { memo, useEffect, useState } from "react";
import { Select, InputReadOnly } from "./index";
import {
  apiGetPublicDistrict,
  apiGetPublicProvinces,
} from "../services/appService";

const Address = ({ setPayload, invalidFields, setInvalidFields }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await apiGetPublicProvinces();
      setProvinces(response?.data || []);
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      const response = await apiGetPublicDistrict(province);
      if (response?.status === 200) {
        setDistricts(response?.data?.districts || []);
      } else {
        setDistricts([]);
      }
    };

    if (province) {
      setDistrict("");
      fetchDistricts();
    } else {
      setDistricts([]);
      setDistrict("");
    }
  }, [province]);

  useEffect(() => {
    const p = provinces.find((item) => item.code == province);
    const d = districts.find((item) => item.code == district);

    if (p && d) setFullAddress(`${d.name}, ${p.name}`);
    else if (p) setFullAddress(p.name);
    else setFullAddress("");
  }, [province, district, provinces, districts]);

  useEffect(() => {
    const p = provinces.find((item) => item.code == province);
    setPayload((prev) => ({
      ...prev,
      province,
      address: fullAddress,
      provinceCode: p ? p.name : "",
    }));
  }, [province, fullAddress, setPayload, provinces]);

  useEffect(() => {
    if (setInvalidFields) {
      setInvalidFields((prev) => prev.filter((i) => i.name !== "address"));
    }
  }, [fullAddress, setInvalidFields]);

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
              label={
                <span>
                  Tỉnh/Thành phố <span className="text-red-500">(*)</span>
                </span>
              }
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
              label={
                <span>
                  Quận/Huyện <span className="text-red-500">(*)</span>
                </span>
              }
              options={districts}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-1/2">
            <Select
              type="ward"
              value=""
              setValue={() => {}}
              label="Phường/Xã"
              options={[]}
            />
          </div>
          <div className="w-1/2">
            <Select
              type="street"
              value=""
              setValue={() => {}}
              label="Đường/Phố"
              options={[]}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-1/2 flex flex-col gap-2">
            <label className="font-medium">Số nhà</label>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md w-full outline-none"
              placeholder="Nhập số nhà"
            />
          </div>
          <div className="w-1/2">
            <InputReadOnly label="Địa chỉ" value={fullAddress} />
            {invalidFields?.some((i) => i.name === "address") && (
              <small className="text-red-500 block mt-1">
                {invalidFields.find((i) => i.name === "address")?.message}
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Address);
