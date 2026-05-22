import moment from "moment";
import db from "../../../models";
import { 
  formatPriceText, 
  formatCategoryType, 
  buildPostDescription, 
  syncProvince, 
  syncDistrict, 
  syncPostFeatures,
  shouldPostBeAutoApproved
} from "../postHelper";

export const updatePost = (postId, payload, actor) =>
  new Promise(async (resolve, reject) => {
    try {
      const where = actor?.role === "admin" ? { id: postId } : { id: postId, userId: actor?.id };
      const post = await db.Post.findOne({ where });
      if (!post) return resolve({ err: 1, msg: "Không tìm thấy hoặc không có quyền" });

      await db.sequelize.transaction(async (transaction) => {
        const isUser = actor?.role !== "admin";

        if (isUser && post.status === "rejected") {
          const overview = await db.Overview.findOne({ where: { postId }, transaction });
          let duration = 3;
          if (overview) {
            const exp = moment(overview.expired, "DD/MM/YYYY");
            const pub = moment(overview.published, "DD/MM/YYYY");
            if (exp.isValid() && pub.isValid()) {
              duration = Math.max(1, exp.diff(pub, 'days'));
            }
          }
          const star = +post.star || 0;
          const pricePerDay = star === 5 ? 10000 : star === 4 ? 7000 : star === 3 ? 5000 : star === 2 ? 3000 : 1000;
          const postPrice = pricePerDay * duration;

          const user = await db.User.findOne({ 
            where: { id: post.userId }, 
            transaction,
            lock: transaction.LOCK.UPDATE 
          });
          if (!user || (user.balance || 0) < postPrice) throw new Error("NOT_ENOUGH_BALANCE");

          const { v4 } = require("uuid");
          await db.User.update({ balance: (user.balance || 0) - postPrice }, { where: { id: post.userId }, transaction });
          await db.Transaction.create({ 
            id: v4(), 
            userId: post.userId, 
            amount: postPrice, 
            type: 'payment', 
            content: `Thanh toán lại phí đăng tin bị từ chối - Mã tin: ${postId.slice(0,8)}`, 
            status: 'success' 
          }, { transaction });
        }
        
        const isAutoApproved = isUser ? await shouldPostBeAutoApproved({ ...post.get({ plain: true }), ...payload }, post.userId) : false;

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
          status: isUser 
            ? (isAutoApproved ? "active" : "pending") 
            : (payload.status || post.status)
        };

        // Lưu lịch sử chỉnh sửa nếu có bất kỳ thông tin chính nào thay đổi
        const hasChanged = 
          updatePayload.title !== post.title ||
          updatePayload.priceNumber !== post.priceNumber ||
          updatePayload.areaNumber !== post.areaNumber ||
          updatePayload.description !== post.description ||
          updatePayload.address !== post.address;

        if (hasChanged) {
          const { v4 } = require("uuid");
          await db.PostHistory.create({
            id: v4(),
            postId,
            editorId: actor?.id,
            oldTitle: post.title,
            newTitle: updatePayload.title,
            oldPrice: post.priceNumber,
            newPrice: updatePayload.priceNumber,
            oldArea: post.areaNumber,
            newArea: updatePayload.areaNumber,
            oldDescription: post.description,
            newDescription: updatePayload.description,
            oldAddress: post.address,
            newAddress: updatePayload.address
          }, { transaction });

          if (isUser) {
            const userRecord = await db.User.findByPk(actor?.id || post.userId);
            const landlordName = userRecord?.name || "Chủ trọ";
            await db.Notification.create({
              id: v4(),
              postId,
              senderId: actor?.id || post.userId,
              title: isAutoApproved ? "Tin đăng cập nhật đã tự động duyệt" : "Tin đăng đã được cập nhật",
              content: isAutoApproved
                ? `Chủ trọ ${landlordName} đã cập nhật tin đăng #${post.id?.slice(0, 8).toUpperCase()} (đã được tự động duyệt).`
                : `Chủ trọ ${landlordName} đã cập nhật tin đăng #${post.id?.slice(0, 8).toUpperCase()}. Vui lòng duyệt lại.`,
              isRead: false
            }, { transaction });
          }
        }

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
          const overviewUpdate = {
            type: formatCategoryType(updatePayload.categoryCode),
          };
          if (isAutoApproved) {
            overviewUpdate.published = moment().format("DD/MM/YYYY");
            const expiredDays = star === 5 ? 30 : star === 4 ? 15 : star === 3 ? 10 : star === 2 ? 7 : 3;
            overviewUpdate.expired = moment().add(expiredDays, 'days').format("DD/MM/YYYY");
            overviewUpdate.bonus = star > 0 ? `Tin VIP ${star}` : "Tin thường";
            
            // Cập nhật ngày đăng ở Attribute
            await db.Attribute.update({ 
              published: moment().format("DD/MM/YYYY")
            }, { where: { postId }, transaction });
          }
          await db.Overview.update(overviewUpdate, { where: { postId }, transaction });
        }

        if (payload.provinceId) await syncProvince(payload.provinceId, payload.provinceName, transaction);
        if (payload.districtId) await syncDistrict(payload.districtId, payload.districtName, payload.provinceId, transaction);
        if (payload.features) await syncPostFeatures(postId, payload.features, transaction);
      });
      resolve({ err: 0, msg: "Cập nhật thành công" });
    } catch (error) {
      if (error.message === "NOT_ENOUGH_BALANCE") {
        resolve({ err: 2, msg: "Số dư tài khoản không đủ để thanh toán lại phí đăng tin bị từ chối." });
      } else {
        reject(error);
      }
    }
  });
