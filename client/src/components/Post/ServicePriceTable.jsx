import React, { useEffect, useState } from "react";
import icons from "../../utils/icons";
import { apiGetAllPackages } from "../../services";

const { GrStar } = icons;

const ServicePriceTable = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await apiGetAllPackages();
        if (response?.data?.err === 0) {
          setPackages(response?.data?.response || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const formatVND = (number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  };

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
              <th className="p-4 border">Giá ngày</th>
              <th className="p-4 border">Giá tuần (7 ngày)</th>
              <th className="p-4 border">Giá tháng (30 ngày)</th>
              <th className="p-4 border">Ưu điểm nổi bật</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-8 text-center text-gray-500 italic"
                >
                  Đang tải bảng giá thực tế...
                </td>
              </tr>
            ) : packages.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-8 text-center text-gray-500 italic"
                >
                  Không tìm thấy cấu hình bảng giá.
                </td>
              </tr>
            ) : (
              packages.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="hover:bg-blue-50/50 transition-colors"
                >
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
                  <td className="p-4 border font-semibold text-blue-600">
                    {formatVND(item.price)}
                  </td>
                  <td className="p-4 border text-gray-700">
                    {formatVND(item.price * 7)}
                  </td>
                  <td className="p-4 border text-gray-700">
                    {formatVND(item.price * 30)}
                  </td>
                  <td className="p-4 border text-sm text-gray-600">
                    {item.benefit}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicePriceTable;
