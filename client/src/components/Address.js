import React, { memo, useEffect, useState } from "react";
import { Select, InputReadOnly } from "./index";
import {
  apiGetPublicDistrict,
  apiGetPublicProvinces,
  apiGetPublicWard,
} from "../services/appService";

const Address = ({ payload, setPayload, invalidFields, setInvalidFields }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [fullAddress, setFullAddress] = useState(payload?.address || "");

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

  const isInitRef = React.useRef(false);

  useEffect(() => {
    const autoFillAddress = async () => {
      if (payload?.address && provinces.length > 0 && !isInitRef.current) {
        isInitRef.current = true;
        
        // Tách chuỗi địa chỉ: "Số nhà, Phường X, Quận Y, Tỉnh Z"
        const parts = payload.address.split(",").map((p) => p.trim());
        if (parts.length === 0) return; 

        // 1. Tìm và set Tỉnh/Thành phố
        const pName = parts[parts.length - 1];
        const p = provinces.find((i) => i.name.includes(pName) || pName.includes(i.name));
        if (!p) return;
        setProvince(p.code);

        // 2. Tìm Quận/Huyện (nếu có)
        if (parts.length >= 2) {
          const dRes = await apiGetPublicDistrict(p.code);
          const dName = parts[parts.length - 2];
          const d = dRes?.data?.districts?.find((i) => i.name.includes(dName) || dName.includes(i.name));
          if (!d) return;
          setDistrict(d.code);

          // 3. Tìm Phường/Xã (nếu có)
          if (parts.length >= 3) {
            const wRes = await apiGetPublicWard(d.code);
            const wName = parts[parts.length - 3];
            const w = wRes?.data?.wards?.find((i) => i.name.includes(wName) || wName.includes(i.name));
            if (w) setWard(w.code);

            // 4. Số nhà (nếu có)
            if (parts.length > 3) {
              setHouseNumber(parts.slice(0, parts.length - 3).join(", "));
            }
          }
        }
      }
    };

    autoFillAddress();
  }, [payload?.address, provinces]);

  useEffect(() => {
    const p = provinces.find((item) => item.code == province);
    const d = districts.find((item) => item.code == district);
    const w = wards.find((item) => item.code == ward);

    let addressArr = [];
    if (houseNumber) addressArr.push(houseNumber);
    if (w) addressArr.push(w.name);
    if (d) addressArr.push(d.name);
    if (p) addressArr.push(p.name);

    if (addressArr.length > 0) {
      setFullAddress(addressArr.join(", "));
    }
  }, [province, district, ward, houseNumber, provinces, districts, wards]);

  useEffect(() => {
    const p = provinces.find((item) => item.code == province);
    setPayload((prev) => ({
      ...prev,
      province: p ? p.code : prev.province,
      address: fullAddress,
      provinceCode: p ? p.name : prev.provinceCode,
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
