import { useState, useEffect } from "react";
import { createSearchParams } from "react-router-dom";
import {
  apiGetPublicDistrict,
  apiGetPublicWard,
} from "../../../services/appService";
import { formatVietnameseToString } from "../../../utils/Common/formatVietnameseToString";

export const useHeaderSearchState = ({
  searchParams,
  categories,
  provinces,
  prices,
  areas,
  navigate,
  path,
  cleanName,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selCategory, setSelCategory] = useState(null);
  const [selProvince, setSelProvince] = useState("");
  const [selDistrict, setSelDistrict] = useState("");
  const [selWard, setSelWard] = useState("");
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selPrice, setSelPrice] = useState(null);
  const [selArea, setSelArea] = useState(null);
  const [selFeatures, setSelFeatures] = useState([]);

  useEffect(() => {
    const categoryCode = searchParams.get("categoryCode");
    const priceCode = searchParams.get("priceCode");
    const areaCode = searchParams.get("areaCode");
    const provinceName = searchParams.get("province");

    if (categories)
      setSelCategory(categories.find((c) => c.code === categoryCode) || null);

    let resolvedProvinceCode = "";
    if (provinces && provinceName) {
      const foundProv = provinces.find((p) => p.value === provinceName);
      if (foundProv) resolvedProvinceCode = foundProv.code;
    }
    setSelProvince(resolvedProvinceCode);

    if (prices) setSelPrice(prices.find((p) => p.code === priceCode) || null);
    if (areas) setSelArea(areas.find((a) => a.code === areaCode) || null);

    if (!categoryCode) {
      const pathCategory = categories?.find((c) =>
        window.location.pathname.includes(formatVietnameseToString(c.value)),
      );
      if (pathCategory) setSelCategory(pathCategory);
    }
  }, [searchParams, categories, prices, areas, provinces]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selProvince) {
        const response = await apiGetPublicDistrict(selProvince);
        if (response?.status === 200) {
          const list = response.data.districts || [];
          setDistricts(list);
          const dName = searchParams.get("district");
          if (dName) {
            const foundDist = list.find(
              (d) => d.name === dName || d.value === dName,
            );
            if (foundDist) setSelDistrict(foundDist.code);
            else setSelDistrict("");
          } else {
            setSelDistrict("");
          }
        }
      } else {
        setDistricts([]);
        setSelDistrict("");
      }
    };
    fetchDistricts();
  }, [selProvince, searchParams]);

  useEffect(() => {
    const fetchWards = async () => {
      if (selDistrict) {
        const response = await apiGetPublicWard(selDistrict);
        if (response?.status === 200) {
          const list = response.data.wards || [];
          setWards(list);
          const wName = searchParams.get("ward");
          if (wName) {
            const foundWard = list.find(
              (w) => w.name === wName || w.value === wName,
            );
            if (foundWard) setSelWard(foundWard.code);
            else setSelWard("");
          } else {
            setSelWard("");
          }
        }
      } else {
        setWards([]);
        setSelWard("");
      }
    };
    fetchWards();
  }, [selDistrict, searchParams]);

  const toggleFeature = (f) =>
    setSelFeatures((prev) =>
      prev.some((x) => x.code === f.code)
        ? prev.filter((x) => x.code !== f.code)
        : [...prev, f],
    );

  const handleApply = () => {
    const params = {};
    if (selCategory?.code) params.categoryCode = selCategory.code;
    if (selPrice?.code) params.priceCode = selPrice.code;
    if (selArea?.code) params.areaCode = selArea.code;
    if (selFeatures.length > 0)
      params.features = selFeatures.map((f) => f.code);

    const provinceName =
      provinces?.find((p) => p.code == selProvince)?.value || "";
    const districtName =
      districts?.find((d) => d.code == selDistrict)?.name || "";
    const wardName = wards?.find((w) => w.code == selWard)?.name || "";

    if (provinceName) params.province = provinceName;
    if (districtName) params.district = districtName;
    if (wardName) params.ward = wardName;

    let locationLabel = cleanName(provinceName);
    if (districtName)
      locationLabel = `${cleanName(districtName)}, ${cleanName(provinceName)}`;
    if (wardName)
      locationLabel = `${wardName}, ${cleanName(districtName)}, ${cleanName(provinceName)}`;

    const titleSearch = `${selCategory?.value || "Cho thuê tất cả"}${locationLabel ? ` tại ${locationLabel}` : ""}`;

    navigate(
      {
        pathname: `/${path.SEARCH}`,
        search: createSearchParams(params).toString(),
      },
      { state: { titleSearch } },
    );
    setIsFilterOpen(false);
  };

  return {
    isFilterOpen,
    setIsFilterOpen,
    selCategory,
    setSelCategory,
    selProvince,
    setSelProvince,
    selDistrict,
    setSelDistrict,
    selWard,
    setSelWard,
    districts,
    wards,
    selPrice,
    setSelPrice,
    selArea,
    setSelArea,
    selFeatures,
    toggleFeature,
    handleApply,
  };
};
