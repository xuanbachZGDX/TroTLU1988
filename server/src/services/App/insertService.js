import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import db from "../../models";
import generateCode from "../../utils/generateCode";
import { dataPrice, dataArea } from "../../utils/data";
import { getNumberFromString, getNumberFromStringV2 } from "../../utils/common";

require("dotenv").config();

const SCRAPED_DATA_DIRECTORY = path.resolve(__dirname, "../../../data");
const SCRAPED_FILES = [
  { fileName: "TroTLU1988.com.json", code: "PHONGTRO", value: "Phòng trọ" },
  {
    fileName: "nha-cho-thue.json",
    code: "NHANGUYENCAN",
    value: "Nhà nguyên căn",
  },
  {
    fileName: "cho-thue-can-ho.json",
    code: "CANHOCHUNGCU",
    value: "Căn hộ chung cư",
  },
  {
    fileName: "cho-thue-can-ho-mini.json",
    code: "CANHOMINI",
    value: "Căn hộ mini",
  },
  {
    fileName: "cho-thue-can-ho-dich-vu.json",
    code: "CANHODICHVU",
    value: "Căn hộ dịch vụ",
  },
  { fileName: "tim-nguoi-o-ghep.json", code: "OGHEP", value: "Ở ghép" },
  { fileName: "cho-thue-mat-bang.json", code: "MATBANG", value: "Mặt bằng" },
];

const ROOM_TYPE_MAP = [
  { key: "Căn hộ dịch vụ", value: "Căn hộ dịch vụ" },
  { key: "Căn hộ mini", value: "Căn hộ mini" },
  { key: "Chung cư mini", value: "Căn hộ mini" },
  { key: "Căn hộ chung cư", value: "Căn hộ chung cư" },
  { key: "Mặt bằng", value: "Mặt bằng" },
  { key: "Nhà nguyên căn", value: "Nhà nguyên căn" },
  { key: "Ở ghép", value: "Ở ghép" },
];

const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(12));
const normalizePhone = (phone) =>
  String(phone || "")
    .replace(/^tel:/i, "")
    .replace(/[^\d+]/g, "")
    .trim();
const inferRoomType = (mainTitle, fallbackValue) =>
  ROOM_TYPE_MAP.find((item) => mainTitle?.includes(item.key))?.value ||
  fallbackValue ||
  "Phòng trọ";
const buildTargetGender = (roomType, item) => {
  if (roomType !== "Ở ghép") return "Tất cả";
  const textContent =
    `${item?.header?.title || ""} ${(item?.mainContent?.info || []).join(" ")}`.toLowerCase();
  return textContent.includes("nữ")
    ? "Nữ"
    : textContent.includes("nam")
      ? "Nam"
      : "Tất cả";
};
const buildBonus = (star) => {
  const starRating = Number(star || 0);
  return starRating > 0 ? `Tin VIP ${starRating} sao` : "Tin thường";
};

const findRangeCode = (ranges, currentValue) =>
  ranges.find((item) => item.max > currentValue && item.min <= currentValue)
    ?.code || null;

export const insertService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const defaultPassword = hashPassword("123456");
      const payloads = SCRAPED_FILES.map((item) => {
        const filePath = path.join(SCRAPED_DATA_DIRECTORY, item.fileName);
        return fs.existsSync(filePath)
          ? { ...item, data: JSON.parse(fs.readFileSync(filePath, "utf8")) }
          : null;
      }).filter(Boolean);

      // Data collection arrays for bulkCreate
      const bulkUsers = [];
      const bulkCategories = [];
      const bulkProvinces = [];
      const bulkDistricts = [];
      const bulkFeatures = [];
      const bulkPosts = [];
      const bulkImages = [];
      const bulkPostFeatures = [];

      // Maps to track uniqueness
      const userMap = new Map();
      const provinceMap = new Map();
      const districtMap = new Map();
      const featureMap = new Map();
      const categoryMap = new Map();

      console.log("Preparing data for bulk insertion...");

      for (let i = 0; i < payloads.length; i++) {
        const payload = payloads[i];
        const categoryCode = payload.code;
        const roomType = inferRoomType(
          payload?.data?.header?.title,
          payload.value,
        );

        if (!categoryMap.has(categoryCode)) {
          bulkCategories.push({
            id: v4(),
            code: categoryCode,
            value: payload.value,
            header: payload?.data?.header?.title,
            description: payload?.data?.header?.description,
            order: i + 1,
          });
          categoryMap.set(categoryCode, true);
        }

        const posts = payload?.data?.body || [];
        for (const item of posts) {
          // Sync User
          const phone = normalizePhone(item?.contactInfo?.content?.phone?.text);
          let userId;
          if (phone) {
            if (userMap.has(phone)) {
              userId = userMap.get(phone);
            } else {
              userId = v4();
              bulkUsers.push({
                id: userId,
                name: item?.contactInfo?.content?.name?.trim() || "Chưa rõ",
                role: "user",
                password: defaultPassword,
                phone,
                zalo: item?.contactInfo?.content?.zalo?.url?.trim() || null,
              });
              userMap.set(phone, userId);
            }
          }

          // Sync Province & District
          const provinceValue = item?.header?.table?.city?.content?.trim();
          const districtValue = item?.header?.table?.district?.content?.trim();
          const pCode = generateCode(
            provinceValue
              ?.replace("Thành phố ", "")
              .replace("Tỉnh ", "")
              .trim(),
          );
          const dCode = generateCode(districtValue);

          if (pCode && !provinceMap.has(pCode)) {
            bulkProvinces.push({ id: v4(), code: pCode, value: provinceValue });
            provinceMap.set(pCode, true);
          }
          if (dCode && !districtMap.has(dCode)) {
            bulkDistricts.push({
              id: v4(),
              code: dCode,
              value: districtValue,
              provinceCode: pCode,
            });
            districtMap.set(dCode, true);
          }

          // Post and Details
          const postId = v4();
          const currentArea = getNumberFromString(item?.header?.class?.area);
          const currentPrice = getNumberFromString(item?.header?.class?.price);

          const pPrice = item?.header?.class?.price || "";
          const pAcreage = item?.header?.class?.area || "";
          const pPublished = item?.header?.class?.updated || "";
          const pOverviewCode = item?.header?.table?.postId?.content || "";
          const pType = roomType;
          const pTarget = buildTargetGender(roomType, item);
          const pBonus = buildBonus(item?.header?.star);
          const pExpired = item?.header?.table?.expiredDate?.content || "";

          bulkPosts.push({
            id: postId,
            title: item?.header?.title || "",
            star: item?.header?.star ? parseInt(item?.header?.star) : 0,
            address: item?.header?.table?.address?.content || "",
            description: JSON.stringify(item?.mainContent?.info || []),
            categoryCode,
            provinceCode: pCode,
            districtCode: dCode,
            priceCode: findRangeCode(dataPrice, currentPrice),
            areaCode: findRangeCode(dataArea, currentArea),
            userId,
            priceNumber: getNumberFromStringV2(item?.header?.class?.price),
            areaNumber: getNumberFromStringV2(item?.header?.class?.area),
            status: "active",
            price: pPrice,
            acreage: pAcreage,
            overviewCode: pOverviewCode,
            type: pType,
            target: pTarget,
            bonus: pBonus,
            published: pPublished,
            expired: pExpired,
          });

          bulkImages.push({
            id: v4(),
            postId,
            image: JSON.stringify(
              Array.isArray(item?.images) ? item.images.filter(Boolean) : [],
            ),
          });

          // Features
          const features = item?.highLight?.content || [];
          for (const text of features) {
            if (!text) continue;
            const code = generateCode(text);
            let fId;
            if (featureMap.has(code)) {
              fId = featureMap.get(code);
            } else {
              fId = v4();
              bulkFeatures.push({ id: fId, code, value: text });
              featureMap.set(code, fId);
            }
            bulkPostFeatures.push({ id: v4(), postId, featureId: fId });
          }
        }
      }

      console.log(`Starting bulk insertion of ${bulkPosts.length} posts...`);
      await db.sequelize.transaction(async (transaction) => {
        // Order matters for FK constraints
        await db.User.bulkCreate(bulkUsers, {
          transaction,
          ignoreDuplicates: true,
        });
        await db.Category.bulkCreate(bulkCategories, {
          transaction,
          ignoreDuplicates: true,
        });
        await db.Province.bulkCreate(bulkProvinces, {
          transaction,
          ignoreDuplicates: true,
        });
        await db.District.bulkCreate(bulkDistricts, {
          transaction,
          ignoreDuplicates: true,
        });
        await db.Feature.bulkCreate(bulkFeatures, {
          transaction,
          ignoreDuplicates: true,
        });

        await db.Post.bulkCreate(bulkPosts, { transaction });
        await db.Image.bulkCreate(bulkImages, { transaction });
        await db.PostFeature.bulkCreate(bulkPostFeatures, { transaction });
      });

      console.log("Bulk insertion completed successfully!");
      resolve("OK");
    } catch (error) {
      console.error("Bulk insertion failed:", error);
      reject(error);
    }
  });
