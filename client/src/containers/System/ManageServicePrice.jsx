import React from "react";
import ServicePriceTable from "../../components/Post/ServicePriceTable";

const ManageServicePrice = () => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-medium">Bảng giá dịch vụ</h1>
      </div>
      <div className="w-full">
        <ServicePriceTable />
      </div>
    </div>
  );
};

export default ManageServicePrice;
