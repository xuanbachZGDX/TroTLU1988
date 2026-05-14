import moment from "moment";
import db from "../../../models";
import { 
  formatPriceText, 
  formatCategoryType, 
  buildPostDescription, 
  syncProvince, 
  syncDistrict, 
  syncPostFeatures 
} from "../postHelper";

export const updatePost = (postId, payload, actor) =>
  new Promise(async (resolve, reject) => {
    try {
      const where = actor?.role === "admin" ? { id: postId } : { id: postId, userId: actor?.id };
      const post = await db.Post.findOne({ where });
      if (!post) return resolve({ err: 1, msg: "Không tìm thấy hoặc không có quyền" });

      await db.sequelize.transaction(async (transaction) => {
        const isUser = actor?.role !== "admin";
        
        const updatePayload = {
          title: payload.title || post.title,
          address: payload.address || post.address,
          categoryCode: payload.categoryCode || post.categoryCode,
          description: payload.description ? buildPostDescription(payload.description) : post.description,
          areaCode: payload.areaCode || post.areaCode,
          priceCode: payload.priceCode || post.priceCode,
          provinceCode: payload.provinceId || post.provinceCode,
          districtCode: payload.districtId || post.districtCode,
          priceNumber: payload.priceNumber !== undefined ? payload.priceNumber : post.priceNumber,
          areaNumber: payload.areaNumber !== undefined ? payload.areaNumber : post.areaNumber,
          star: isUser ? post.star : (payload.star !== undefined ? payload.star : post.star), 
          status: isUser ? "pending" : (payload.status || post.status)
        };

        await db.Post.update(updatePayload, { where: { id: postId }, transaction });

        await db.Attribute.update({ 
          price: formatPriceText(updatePayload.priceNumber), 
          acreage: `${updatePayload.areaNumber} m2` 
        }, { where: { postId }, transaction });

        if (payload.images) {
          await db.Image.update({ image: JSON.stringify(payload.images) }, { where: { postId }, transaction });
        }
        
        const star = +updatePayload.star;
        if (!isUser) {
          const overviewUpdate = {
            type: formatCategoryType(updatePayload.categoryCode),
            bonus: star > 0 ? `Tin VIP ${star}` : "Tin thường",
            status: updatePayload.status
          };
          if (payload.postingDuration) {
            overviewUpdate.expired = moment().add(+payload.postingDuration, 'days').format("DD/MM/YYYY");
          }
          await db.Overview.update(overviewUpdate, { where: { postId }, transaction });
        } else {
          await db.Overview.update({ 
            type: formatCategoryType(updatePayload.categoryCode),
          }, { where: { postId }, transaction });
        }

        if (payload.provinceId) await syncProvince(payload.provinceId, payload.provinceName, transaction);
        if (payload.districtId) await syncDistrict(payload.districtId, payload.districtName, payload.provinceId, transaction);
        if (payload.features) await syncPostFeatures(postId, payload.features, transaction);
      });
      resolve({ err: 0, msg: "Cập nhật thành công" });
    } catch (error) {
      reject(error);
    }
  });
