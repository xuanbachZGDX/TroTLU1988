import React, { memo, useEffect, useState } from "react";
import { Select, InputReadOnly } from "./index";
import {
  apiGetPublicDistrict,
  apiGetPublicProvinces,
  apiGetPublicWard,
} from "../services/appService";

const Address = ({ setPayload, invalidFields, setInvalidFields }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
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
    const fetchWards = async () => {
      const response = await apiGetPublicWard(district);
      if (response?.status === 200) {
        setWards(response?.data?.wards || []);
      } else {
        setWards([]);
      }
    };

    if (district) {
      setWard("");
      fetchWards();
    } else {
      setWards([]);
      setWard("");
    }
  }, [district]);

  useEffect(() => {
    const p = provinces.find((item) => item.code == province);
    const d = districts.find((item) => item.code == district);
    const w = wards.find((item) => item.code == ward);

    let addressArr = [];
    if (houseNumber) addressArr.push(houseNumber);
    if (w) addressArr.push(w.name);
    if (d) addressArr.push(d.name);
    if (p) addressArr.push(p.name);

    setFullAddress(addressArr.join(", "));
  }, [province, district, ward, houseNumber, provinces, districts, wards]);

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
              setInvalidFields={setInvalidFields}
              invalidFields={invalidFields}
              type="ward"
              value={ward}
              setValue={setWard}
              label={
                <span>
                  Phường/Xã <span className="text-red-500">(*)</span>
                </span>
              }
              options={wards}
            />
          </div>
          <div className="w-1/2 flex flex-col gap-2">
            <label className="font-medium">Số nhà</label>
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
      </div>
    </div>
  );
};

export default memo(Address);
