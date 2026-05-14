import React, { memo, useEffect, useState, useRef } from "react";
import {
  apiGetPublicDistrict,
  apiGetPublicProvinces,
  apiGetPublicWard,
} from "../../services/appService";
import AddressView from "./Address/AddressView";

const Address = ({ payload, setPayload, invalidFields, setInvalidFields }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [province, setProvince] = useState(payload.provinceId || "");
  const [district, setDistrict] = useState(payload.districtId || "");
  const [ward, setWard] = useState(payload.wardId || "");
  const [houseNumber, setHouseNumber] = useState("");
  const [fullAddress, setFullAddress] = useState(payload?.address || "");
  const [mapAddress, setMapAddress] = useState(payload?.address || ""); 

  const isInitRef = useRef(false);
  const isAutoFillingRef = useRef(false);
  const isFirstMountRef = useRef(true);

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await apiGetPublicProvinces();
      if (response?.status === 200) setProvinces(response?.data || []);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      const response = await apiGetPublicDistrict(province);
      if (response?.status === 200) setDistricts(response?.data?.districts || []);
      else setDistricts([]);
    };
    if (province) {
      if (!isAutoFillingRef.current && !isFirstMountRef.current) setDistrict("");
      fetchDistricts();
    } else {
      setDistricts([]);
      if (!isAutoFillingRef.current && !isFirstMountRef.current) setDistrict("");
    }
  }, [province]);

  useEffect(() => {
    const fetchWards = async () => {
      const response = await apiGetPublicWard(district);
      if (response?.status === 200) setWards(response?.data?.wards || []);
      else setWards([]);
    };
    if (district) {
      if (!isAutoFillingRef.current && !isFirstMountRef.current) setWard("");
      fetchWards();
    } else {
      setWards([]);
      if (!isAutoFillingRef.current && !isFirstMountRef.current) setWard("");
    }
  }, [district]);

  useEffect(() => {
    const autoFillAddress = async () => {
      if (payload?.address && provinces.length > 0 && !isInitRef.current) {
        isInitRef.current = true;
        isAutoFillingRef.current = true;
        const parts = payload.address.split(",").map((p) => p.trim());
        if (parts.length === 0) { isAutoFillingRef.current = false; return; }
        const pName = parts[parts.length - 1];
        const p = provinces.find((i) => i.name.includes(pName) || pName.includes(i.name));
        if (!p) { isAutoFillingRef.current = false; return; }
        setProvince(p.code);
        let foundDistrict = null, foundWard = null, foundHouseNumber = "";
        if (parts.length >= 2) {
          const dRes = await apiGetPublicDistrict(p.code);
          const dName = parts[parts.length - 2].toLowerCase().replace(/quận|huyện|thị xã|thành phố/g, "").trim();
          const d = dRes?.data?.districts?.find((i) => {
            const name = i.name.toLowerCase().replace(/quận|huyện|thị xã|thành phố/g, "").trim();
            return name.includes(dName) || dName.includes(name);
          });
          if (d) {
            setDistrict(d.code); foundDistrict = d;
            if (parts.length >= 3) {
              const wRes = await apiGetPublicWard(d.code);
              const wName = parts[parts.length - 3].toLowerCase().replace(/phường|xã|thị trấn/g, "").trim();
              const w = wRes?.data?.wards?.find((i) => {
                const name = i.name.toLowerCase().replace(/phường|xã|thị trấn/g, "").trim();
                return name.includes(wName) || wName.includes(name);
              });
              if (w) { setWard(w.code); foundWard = w; }
              if (parts.length > 3) { foundHouseNumber = parts.slice(0, parts.length - 3).join(", "); setHouseNumber(foundHouseNumber); }
            }
          }
        }
        const addrParts = [];
        if (foundHouseNumber) addrParts.push(foundHouseNumber);
        if (foundWard) addrParts.push(foundWard.name);
        else if (parts.length >= 3) addrParts.push(parts[parts.length - 3]);
        if (foundDistrict) addrParts.push(foundDistrict.name);
        else if (parts.length >= 2) addrParts.push(parts[parts.length - 2]);
        addrParts.push(p.name);
        const computedAddress = addrParts.join(", ");
        setFullAddress(computedAddress);
        setPayload((prev) => ({
          ...prev,
          provinceId: String(p.code), provinceName: p.name,
          districtId: foundDistrict ? String(foundDistrict.code) : prev.districtId, districtName: foundDistrict ? foundDistrict.name : prev.districtName,
          wardId: foundWard ? String(foundWard.code) : prev.wardId, address: computedAddress,
        }));
        setTimeout(() => { isAutoFillingRef.current = false; }, 1000);
      }
    };
    autoFillAddress();
  }, [payload?.address, provinces]);

  useEffect(() => {
    if (isAutoFillingRef.current) return;
    const p = provinces.find((item) => item.code == province);
    const d = districts.find((item) => item.code == district);
    const w = wards.find((item) => item.code == ward);
    let addressArr = [];
    if (houseNumber) addressArr.push(houseNumber);
    if (w) addressArr.push(w.name);
    if (d) addressArr.push(d.name);
    if (p) addressArr.push(p.name);
    if (addressArr.length > 0) setFullAddress(addressArr.join(", "));
  }, [province, district, ward, houseNumber, provinces, districts, wards]);

  useEffect(() => {
    if (isAutoFillingRef.current) return;
    const p = provinces.find((item) => item.code == province);
    const d = districts.find((item) => item.code == district);
    const w = wards.find((item) => item.code == ward);
    setPayload((prev) => ({
      ...prev,
      provinceId: p ? String(p.code) : prev.provinceId, provinceName: p ? p.name : prev.provinceName,
      districtId: d ? String(d.code) : prev.districtId, districtName: d ? d.name : prev.districtName,
      wardId: w ? String(w.code) : prev.wardId, address: fullAddress,
    }));
  }, [province, district, ward, fullAddress, setPayload, provinces, districts, wards]);

  useEffect(() => {
    const timer = setTimeout(() => { isFirstMountRef.current = false; }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { setMapAddress(fullAddress); }, 800);
    return () => clearTimeout(timer);
  }, [fullAddress]);

  useEffect(() => {
    if (setInvalidFields) setInvalidFields((prev) => prev.filter((i) => i.name !== "address"));
  }, [fullAddress, setInvalidFields]);

  return (
    <AddressView 
      province={province} setProvince={setProvince} provinces={provinces}
      district={district} setDistrict={setDistrict} districts={districts}
      ward={ward} setWard={setWard} wards={wards}
      houseNumber={houseNumber} setHouseNumber={setHouseNumber}
      fullAddress={fullAddress} mapAddress={mapAddress}
      invalidFields={invalidFields} setInvalidFields={setInvalidFields}
    />
  );
};

export default memo(Address);
