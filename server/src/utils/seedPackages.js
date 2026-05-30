import db from "../models";

const defaultPackages = [
  {
    id: "v5",
    name: "Tin VIP Nổi Bật",
    star: 5,
    price: 10000,
    color: "text-red-600",
    benefit: "Vị trí đầu tiên, tiêu đề Đỏ In Hoa, nhãn VIP Nổi bật",
  },
  {
    id: "v4",
    name: "Tin VIP 1",
    star: 4,
    price: 7000,
    color: "text-[#E13491]",
    benefit: "Vị trí sau VIP Nổi bật, tiêu đề Hồng, nhãn VIP 1",
  },
  {
    id: "v3",
    name: "Tin VIP 2",
    star: 3,
    price: 5000,
    color: "text-[#F57C00]",
    benefit: "Vị trí sau VIP 1, tiêu đề Cam, nhãn VIP 2",
  },
  {
    id: "v2",
    name: "Tin VIP 3",
    star: 2,
    price: 3000,
    color: "text-[#1976D2]",
    benefit: "Vị trí sau VIP 2, tiêu đề Xanh, nhãn VIP 3",
  },
  {
    id: "v0",
    name: "Tin thường",
    star: 0,
    price: 1000,
    color: "text-gray-600",
    benefit: "Vị trí sau cùng, tiêu đề xanh mặc định",
  },
];

const seedPackages = async () => {
  try {
    const count = await db.Package.count();
    if (count === 0) {
      console.log(">>> Hệ thống đang tạo cấu hình mặc định các Gói VIP...");
      await db.Package.bulkCreate(defaultPackages);
      console.log(">>> Tạo cấu hình Gói VIP thành công!");
    } else {
      console.log(">>> Cấu hình Gói VIP đã tồn tại.");
    }
  } catch (error) {
    console.error(">>> Lỗi khi tạo Gói VIP:", error);
  }
};

export default seedPackages;
