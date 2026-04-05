import db from "../models";
import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import generateCode from "../utils/generateCode";
import { dataPrice, dataArea } from "../utils/data";
import { getNumberFromString } from "../utils/common";

import nhatrothue from "../../data/nha-cho-thue.json";
import canHoDichVu from "../../data/cho-thue-can-ho-dich-vu.json";
import canHoMini from "../../data/cho-thue-can-ho-mini.json";
import canHo from "../../data/cho-thue-can-ho.json";
import matBang from "../../data/cho-thue-mat-bang.json";
import phongTro123 from "../../data/phongtro123.com.json";
import timNguoiOGhep from "../../data/tim-nguoi-o-ghep.json";

require("dotenv").config();

const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(12));

const parseDateToSQL = (dateString) => {
  if (!dateString) return null;
  const match = dateString.match(
    /(\d{1,2}:\d{1,2})\s+(\d{1,2}\/\d{1,2}\/\d{4})/,
  );
  if (match) {
    const timePart = match[1];
    const datePart = match[2];
    const [day, month, year] = datePart.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${timePart}:00`;
  }
  return null;
};

export const insertService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const allDataFiles = [
        { data: phongTro123, code: "PHONGTRO", value: "Phòng trọ" },
        { data: nhatrothue, code: "NHANGUYENCAN", value: "Nhà nguyên căn" },
        { data: canHo, code: "CANHOCHUNGCU", value: "Căn hộ chung cư" },
        { data: canHoMini, code: "CANHOMINI", value: "Căn hộ mini" },
        { data: canHoDichVu, code: "CANHODICHVU", value: "Căn hộ dịch vụ" },
        { data: timNguoiOGhep, code: "OGHEP", value: "Ở ghép" },
        { data: matBang, code: "MATBANG", value: "Mặt bằng" },
      ];

      const typeMap = [
        { key: "Căn Hộ Dịch Vụ", val: "Căn hộ dịch vụ" },
        { key: "Căn Hộ Mini", val: "Căn hộ mini" },
        { key: "Chung Cư Mini", val: "Căn hộ mini" },
        { key: "Căn Hộ Chung Cư", val: "Căn hộ chung cư" },
        { key: "Mặt Bằng", val: "Mặt bằng" },
        { key: "Nhà Nguyên Căn", val: "Nhà nguyên căn" },
        { key: "Ở Ghép", val: "Ở ghép" },
      ];

      for (const fileItem of allDataFiles) {
        const dataBody = fileItem.data.body || [];
        const categoryCode = fileItem.code;

        const fileMainTitle = fileItem.data?.header?.title || "";
        const fileMainDesc = fileItem.data?.header?.description || "";
        const roomType =
          typeMap.find((t) => fileMainTitle.includes(t.key))?.val ||
          "Phòng trọ";
        const isRoommate = roomType === "Ở ghép";

        await db.Category.findOrCreate({
          where: { code: categoryCode },
          defaults: {
            code: categoryCode,
            value: fileItem.value,
            header: fileMainTitle,
            subheader: fileMainDesc,
          },
        });

        for (const item of dataBody) {
          let post_id = v4();
          let labelCode = generateCode(item?.header?.table?.district?.content);
          let attributeId = v4();
          let userId = v4();
          let imageId = v4();
          let overviewId = v4();
          let currentArea = getNumberFromString(item?.header?.class?.area);
          let currentPrice = getNumberFromString(item?.header?.class?.price);

          let targetGenders = "Tất cả";
          if (isRoommate) {
            const textContent =
              `${item?.header?.title} ${JSON.stringify(item?.mainContent?.info)}`.toLowerCase();
            if (textContent.includes("nữ")) targetGenders = "Nữ";
            else if (textContent.includes("nam")) targetGenders = "Nam";
          }

          let postBonus = "Tin thường";
          const starRating = item?.header?.star;
          if (starRating && Number(starRating) > 0) {
            postBonus = `Tin VIP ${starRating} sao`;
          }

          await db.Post.create({
            id: post_id,
            title: item?.header.title,
            star: item?.header?.star,
            labelCode,
            address: item?.header?.table?.address.content,
            attributeId,
            categoryCode: categoryCode,
            description: JSON.stringify(item?.mainContent?.info),
            userId,
            overviewId,
            imageId,
            areaCode: dataArea.find(
              (area) => area.max > currentArea && area.min <= currentArea,
            )?.code,
            priceCode: dataPrice.find(
              (price) => price.max > currentPrice && price.min <= currentPrice,
            )?.code,
          });

          await db.Attribute.create({
            id: attributeId,
            price: item?.header?.class?.price,
            acreage: item?.header?.class?.area,
            published: item?.header?.class?.updated,
            hashtag: JSON.stringify(item?.highLight?.content || []),
          });

          await db.Image.create({
            id: imageId,
            image: JSON.stringify(
              Array.isArray(item?.images)
                ? item.images.filter((img) => !!img)
                : [],
            ),
          });

          await db.Label.findOrCreate({
            where: { code: labelCode },
            defaults: {
              code: labelCode,
              value: item?.header?.table?.district?.content,
            },
          });

          await db.Overview.create({
            id: overviewId,
            code: item?.header?.table?.postId?.content || "",
            area: item?.header?.table?.city?.content || "",
            type: roomType,
            target: targetGenders,
            bonus: postBonus,
            created: parseDateToSQL(
              item?.header?.table?.publishedDate?.content,
            ),
            expired: parseDateToSQL(item?.header?.table?.expiredDate?.content),
          });

          await db.User.create({
            id: userId,
            name: item?.contactInfo?.content?.name,
            password: hashPassword("123456"),
            phone: item?.contactInfo?.content?.phone?.text || null,
            zalo: item?.contactInfo?.content?.zalo?.url || null,
          });
        }
      }

      resolve("All files inserted successfully!");
    } catch (error) {
      reject(error);
    }
  });

export const createPricesAndAreas = () =>
  new Promise((resolve, reject) => {
    try {
      dataPrice.forEach(async (item, index) => {
        await db.Price.create({
          order: index + 1,
          code: item.code,
          value: item.value,
        });
      });
      dataArea.forEach(async (item, index) => {
        await db.Area.create({
          order: index + 1,
          code: item.code,
          value: item.value,
        });
      });
      resolve("OK");
    } catch (err) {
      reject(err);
    }
  });
