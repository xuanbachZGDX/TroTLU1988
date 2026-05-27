import db from "../../models";
import { v4 as generateId } from "uuid";
import generateCode from "../../utils/generateCode.js";

export const CATEGORY_TYPE_MAP = {
  PHONGTRO: "Phòng trọ",
  NHANGUYENCAN: "Nhà nguyên căn",
  CANHOCHUNGCU: "Căn hộ chung cư",
  CANHOMINI: "Căn hộ mini",
  CANHODICHVU: "Căn hộ dịch vụ",
  OGHEP: "Ở ghép",
  MATBANG: "Mặt bằng",
};

export const formatCategoryType = (categoryCode = "") =>
  CATEGORY_TYPE_MAP[categoryCode] || categoryCode || "";

export const formatPriceText = (priceNumber = 0) =>
  priceNumber < 1
    ? `${priceNumber * 1000000} đồng/tháng`
    : `${priceNumber} triệu/tháng`;

export const buildPostDescription = (description) => {
  if (typeof description === 'string') return description;
  return JSON.stringify(description || []);
};

export const syncProvince = async (provinceId, provinceName, transaction) => {
  if (!provinceId || !provinceName) return;
  await db.Province.findOrCreate({
    where: { id: String(provinceId) },
    defaults: { id: String(provinceId), code: String(provinceId), value: provinceName },
    transaction,
  });
};

export const syncDistrict = async (districtId, districtName, provinceId, transaction) => {
  if (!districtId || !districtName) return "";
  await db.District.findOrCreate({
    where: { id: String(districtId) },
    defaults: { id: String(districtId), code: String(districtId), value: districtName, provinceCode: String(provinceId) },
    transaction,
  });
  return String(districtId);
};

export const syncPostFeatures = async (postId, features = [], transaction) => {
  if (!postId) return;
  await db.PostFeature.destroy({ where: { postId }, transaction });
  if (features && features.length > 0) {
    for (const text of features) {
      if (!text) continue;
      const code = generateCode(text);
      const [featureRecord] = await db.Feature.findOrCreate({ where: { code }, defaults: { id: generateId(), code, value: text }, transaction });
      await db.PostFeature.create({ id: generateId(), postId, featureId: featureRecord.id }, { transaction });
    }
  }
};

export const getStandardPostInclude = () => [
  { model: db.Image, as: "images", attributes: ["image"] },
  { model: db.Attribute, as: "attributes", attributes: ["price", "acreage", "published"] },
  { model: db.User, as: "user", attributes: ["name", "zalo", "phone", "avatar"] },
  { model: db.Province, as: "province", attributes: ["code", "value"] },
  { model: db.District, as: "district", attributes: ["code", "value"] },
  { model: db.Feature, as: "features", attributes: ["code", "value"], through: { attributes: [] } },
];

export const shouldPostBeAutoApproved = async (postOrBody, userId) => {
  const { getSystemSettings } = require("../../utils/systemSettings");
  const settings = getSystemSettings();
  if (!settings.autoApprove) return false;

  const user = await db.User.findByPk(userId);
  if (user && user.role === "admin") return true;

  const star = +postOrBody.star || 0;
  // Tầng 1: Nếu là tin đăng VIP thì được tự động duyệt ngay
  if (star > 0) return true;

  // Tầng 2: Nếu là tin thường, kiểm tra lịch sử chủ trọ uy tín
  const activeCount = await db.Post.count({
    where: { userId, status: "active" }
  });
  const rejectedCount = await db.Post.count({
    where: { userId, status: "rejected" }
  });

  // Điều kiện uy tín: Có tối thiểu 5 tin đăng hoạt động và chưa từng bị từ chối tin nào
  return activeCount >= 5 && rejectedCount === 0;
};

