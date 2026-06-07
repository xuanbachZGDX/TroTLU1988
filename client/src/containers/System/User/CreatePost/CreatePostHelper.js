export const getInitialPayload = (isEdit, dataEdit) => {
  const d = isEdit ? dataEdit : null;
  return {
    categoryCode: d?.categoryCode || "",
    title: d?.title || "",
    priceNumber: (d?.priceNumber || 0) * 1000000,
    areaNumber: d?.areaNumber || 0,
    images: d?.images?.image ? JSON.parse(d?.images?.image) : [],
    address: d?.address || "",
    priceCode: d?.priceCode || "",
    areaCode: d?.areaCode || "",
    description: d?.description || "",
    star: d?.star || "0",
    postingDuration: 3,
    features: d?.features ? d.features.map((f) => f.value) : [],
    provinceId: d?.provinceCode || "",
    districtId: d?.districtCode || "",
  };
};
