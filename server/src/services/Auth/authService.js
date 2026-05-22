import db from "../../models";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import { client, hashPassword, comparePassword } from "./authHelper";
import { forgotPasswordService, resetPasswordService } from "./passwordService";

require("dotenv").config();

export { forgotPasswordService, resetPasswordService };

const normalizeRole = (role) => {
  const normalized = String(role || "").trim().toLowerCase();

  if (normalized === "admin") return "admin";
  if (["landlord", "shop", "owner"].includes(normalized)) return "landlord";

  return "user";
};

const resolveAccountRole = (accountType) => normalizeRole(accountType);

export const registerService = ({ phone, password, name, accountType }) =>
  new Promise(async (resolve, reject) => {
    try {
      const role = resolveAccountRole(accountType);
      const response = await db.User.findOrCreate({
        where: { phone },
        defaults: { phone, name, role, password: hashPassword(password), id: v4() },
      });
      const token = response[1] && jwt.sign(
        { id: response[0].id, phone: response[0].phone, role },
        process.env.SECRET_KEY, { expiresIn: "2d" }
      );
      resolve({ err: token ? 0 : 2, msg: token ? "Đăng ký thành công!" : "Số điện thoại đã được sử dụng!", token: token || null });
    } catch (error) { reject(error); }
  });

export const loginService = ({ phone, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({ where: { phone }, raw: true });
      if (response && response.status === "blocked") return resolve({ err: 3, msg: "Tài khoản bị khóa!", token: null });
      const checkPassword = response && comparePassword(password, response.password);
      const role = normalizeRole(response?.role);
      const token = checkPassword && jwt.sign(
        { id: response.id, phone: response.phone, role },
        process.env.SECRET_KEY, { expiresIn: "2d" }
      );
      resolve({ err: token ? 0 : 2, msg: token ? "Đăng nhập thành công!" : response ? "Mật khẩu không chính xác!" : "Tài khoản không tồn tại!", token: token || null });
    } catch (error) { reject(error); }
  });

export const loginGoogleService = (credential, accountType = null) =>
  new Promise(async (resolve, reject) => {
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const { email, name, picture } = ticket.getPayload();

      if (!email) {
        return resolve({ err: 1, msg: "Tài khoản Google không cung cấp email hợp lệ!", token: null });
      }

      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        if (existingUser.status === "blocked") {
          return resolve({ err: 3, msg: "Tài khoản bị khóa!", token: null });
        }

        const role = normalizeRole(existingUser.role);
        const token = jwt.sign(
          { id: existingUser.id, phone: existingUser.phone || null, email: existingUser.email, role },
          process.env.SECRET_KEY,
          { expiresIn: "2d" }
        );

        return resolve({
          err: 0,
          msg: "Đăng nhập Google thành công!",
          token,
          role,
          requiresAccountType: false,
        });
      }

      if (!accountType) {
        return resolve({
          err: 0,
          msg: "Vui lòng chọn loại tài khoản để hoàn tất đăng nhập Google.",
          token: null,
          requiresAccountType: true,
          profile: { email, name, picture },
        });
      }

      const role = resolveAccountRole(accountType);
      if (!["user", "landlord"].includes(role)) {
        return resolve({ err: 1, msg: "Loại tài khoản không hợp lệ!", token: null });
      }

      const user = await db.User.create({
        id: v4(),
        email,
        name,
        avatar: picture,
        role,
      });

      if (user.status === "blocked") {
        return resolve({ err: 3, msg: "Tài khoản bị khóa!", token: null });
      }

      const token = jwt.sign(
        { id: user.id, phone: user.phone || null, email: user.email, role },
        process.env.SECRET_KEY,
        { expiresIn: "2d" }
      );

      resolve({
        err: 0,
        msg: "Tạo tài khoản bằng Google thành công!",
        token,
        role,
        requiresAccountType: false,
      });
    } catch (error) { reject(error); }
  });
