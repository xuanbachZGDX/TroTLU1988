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
      // accountType: 'user' (khách hàng tìm phòng) hoặc 'landlord' (chủ trọ đăng tin)
      const role = resolveAccountRole(accountType);
      const response = await db.User.findOrCreate({
        where: { phone },
        defaults: { phone, name, role, password: hashPassword(password), id: v4() },
      });
      const token = response[1] && jwt.sign(
        { id: response[0].id, phone: response[0].phone, role },
        process.env.SECRET_KEY, { expiresIn: "2d" }
      );
      resolve({ err: token ? 0 : 2, msg: token ? "Register success!" : "Phone used!", token: token || null });
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
      resolve({ err: token ? 0 : 2, msg: token ? "Login success!" : response ? "Wrong password!" : "Not found!", token: token || null });
    } catch (error) { reject(error); }
  });

export const loginGoogleService = (credential) =>
  new Promise(async (resolve, reject) => {
    try {
      const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
      const { email, name, picture } = ticket.getPayload();
      const response = await db.User.findOrCreate({ where: { email }, defaults: { id: v4(), email, name, avatar: picture, role: "user" } });
      const user = response[0];
      if (user.status === "blocked") return resolve({ err: 3, msg: "Tài khoản bị khóa!", token: null });
      const role = normalizeRole(user.role);
      const token = jwt.sign(
        { id: user.id, phone: user.phone || null, email: user.email, role },
        process.env.SECRET_KEY, { expiresIn: "2d" }
      );
      resolve({ err: 0, msg: "Login Google success!", token });
    } catch (error) { reject(error); }
  });
