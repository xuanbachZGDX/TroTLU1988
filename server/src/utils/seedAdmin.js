import db from "../models";
import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import adminAccount from "../config/adminAccount.json";

const seedAdmin = async () => {
  try {
    // Kiểm tra xem đã có tài khoản admin nào chưa
    const admin = await db.User.findOne({ where: { role: "admin" } });

    if (!admin) {
      console.log(">>> Hệ thống đang tạo tài khoản Admin duy nhất...");
      await db.User.create({
        id: v4(),
        phone: adminAccount.phone,
        password: bcrypt.hashSync(adminAccount.password, bcrypt.genSaltSync(12)),
        name: adminAccount.name,
        role: "admin",
        balance: 100000000, 
        status: "active"
      });
      console.log(">>> Tài khoản Admin đã được tạo thành công!");
    } else {
      console.log(">>> Tài khoản Admin đã tồn tại.");
    }
  } catch (error) {
    console.error(">>> Lỗi khi tạo tài khoản Admin:", error);
  }
};

export default seedAdmin;
