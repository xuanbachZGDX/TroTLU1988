import { v4 as generateId } from "uuid";
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

export const createNewPostService = (body, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const postId = generateId();
      await db.sequelize.transaction(async (transaction) => {
        const star = +body.star || 0;
        const duration = +body.postingDuration || 3;
        const pricePerDay = star === 5 ? 10000 : star === 4 ? 7000 : star === 3 ? 5000 : star === 2 ? 3000 : 1000;
        const postPrice = pricePerDay * duration;

        const user = await db.User.findOne({ 
          where: { id: userId }, 
          transaction,
          lock: transaction.LOCK.UPDATE 
        });
        if (!user || (user.balance || 0) < postPrice) throw new Error("NOT_ENOUGH_BALANCE");

        await db.User.update({ balance: (user.balance || 0) - postPrice }, { where: { id: userId }, transaction });
        await db.Transaction.create({ 
          id: generateId(), userId, amount: postPrice, type: 'payment', 
          content: `Thanh toán phí đăng tin ${star > 0 ? 'VIP ' + star : 'thường'} - Mã tin: ${postId.slice(0,8)}`, 
          status: 'success' 
        }, { transaction });

        await syncProvince(body.provinceId, body.provinceName, transaction);
        await syncDistrict(body.districtId, body.districtName, body.provinceId, transaction);

        const isAutoApproved = await shouldPostBeAutoApproved(body, userId);
        const initialStatus = isAutoApproved ? "active" : "pending";

        await db.Post.create({
          id: postId, title: body.title, address: body.address,
          categoryCode: body.categoryCode, description: buildPostDescription(body.description),
          userId, areaCode: body.areaCode, priceCode: body.priceCode,
          provinceCode: body.provinceId, districtCode: body.districtId, 
          priceNumber: body.priceNumber || 0, areaNumber: body.areaNumber || 0,
          star: body.star || "0", status: initialStatus
        }, { transaction });

        await db.Attribute.create({ id: generateId(), postId, price: formatPriceText(body.priceNumber), acreage: `${body.areaNumber} m2`, published: moment().format("DD/MM/YYYY") }, { transaction });
        await db.Image.create({ id: generateId(), postId, image: JSON.stringify(body.images || []) }, { transaction });

        await db.Overview.create({
          id: generateId(), postId, code: `#${Math.floor(Math.random() * 1000000)}`,
          type: formatCategoryType(body.categoryCode), target: body.target || "Tất cả",
          bonus: star > 0 ? `Tin VIP ${star}` : "Tin thường", published: moment().format("DD/MM/YYYY"),
          expired: moment().add(duration, 'days').format("DD/MM/YYYY"),
        }, { transaction });

        await syncPostFeatures(postId, body.features, transaction);
      });
      resolve({ err: 0, msg: "Tạo tin đăng thành công" });
    } catch (error) {
      if (error.message === "NOT_ENOUGH_BALANCE") resolve({ err: 2, msg: "Số dư không đủ." });
      else reject(error);
    }
  });
