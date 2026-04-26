import React, { memo, useEffect, useState } from "react";
import { Select, InputReadOnly } from "./index";
import {
  apiGetPublicDistrict,
  apiGetPublicProvinces,
} from "../services/appService";

const Address = ({ setPayload }) => {
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

  // Tạo địa chỉ khi chọn tỉnh + huyện
  useEffect(() => {
    const p = provinces.find((item) => item.code === province);
    const d = districts.find((item) => item.code === district);

    if (p && d) setFullAddress(`${d.name}, ${p.name}`);
    else if (p) setFullAddress(p.name);
    else setFullAddress("");
  }, [province, district, provinces, districts]);

  useEffect(() => {
    setPayload((prev) => ({ ...prev, province, address: fullAddress }));
  }, [province, fullAddress, setPayload]);

  return (
    <div>
      <h2 className="text-xl font-semibold py-4">Địa chỉ cho thuê</h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Select
            type="province"
            value={province}
            setValue={setProvince}
            label="Tỉnh/Thành phố"
            options={provinces}
          />
          <Select
            type="district"
            value={district}
            setValue={setDistrict}
            label="Quận/Huyện"
            options={districts}
          />
        </div>
        <InputReadOnly label="Địa chỉ chính xác" value={fullAddress} />
      </div>
    </div>
  );
};

export default memo(Address);
