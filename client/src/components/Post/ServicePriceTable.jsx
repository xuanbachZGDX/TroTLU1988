import React from "react";
import icons from "../../utils/icons";
import { priceList } from "../../utils/constant";

const { GrStar } = icons;

const ServicePriceTable = () => {
  return (
    <div className="w-full bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-blue-800 uppercase border-b pb-4">
        Bảng giá dịch vụ đăng tin
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="p-4 border">Loại tin</th>
              <th className="p-4 border">Giá tuần</th>
              <th className="p-4 border">Giá tháng</th>
              <th className="p-4 border">Ưu điểm nổi bật</th>
            </tr>
          </thead>
          <tbody>
            {priceList.map((item, index) => (
              <tr key={index} className="hover:bg-blue-50 transition-colors">
                <td className="p-4 border font-bold">
                  <div className="flex flex-col gap-1">
                    <span className={item.color}>{item.name}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <GrStar
                          key={i}
                          size={10}
                          color={i < item.star ? "#febb02" : "#ddd"}
                        />
                      ))}
                    </div>
                  </div>
                </td>
                <td className="p-4 border">{item.week}</td>
                <td className="p-4 border">{item.month}</td>
                <td className="p-4 border text-sm text-gray-600">
                  {item.benefit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicePriceTable;
