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
  shouldPostBeAutoApproved,
} from "../postHelper";

export const createNewPostService = (body, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      if (body.images && body.images.length > 10) {
        throw new Error("EXCEEDED_IMAGE_LIMIT");
      }
      const postId = generateId();
      await db.sequelize.transaction(async (transaction) => {
        const star = +body.star || 0;
        const duration = +body.postingDuration || 3;

        // Fetch package price from database dynamically
        const targetPackage = await db.Package.findOne({
          where: { star },
          transaction,
        });
        const pricePerDay = targetPackage
          ? targetPackage.price
          : star === 5
            ? 10000
            : star === 4
              ? 7000
              : star === 3
                ? 5000
                : star === 2
                  ? 3000
                  : 1000;
        const postPrice = pricePerDay * duration;

        const user = await db.User.findOne({
          where: { id: userId },
          transaction,
          lock: transaction.LOCK.UPDATE,
        });
        if (!user) throw new Error("USER_NOT_FOUND");

        if (user.kycStatus !== "verified") {
          const postCount = await db.Post.count({
            where: { userId },
            transaction,
          });
          if (postCount >= 3) {
            throw new Error("KYC_REQUIRED_EXCEEDED_POSTS");
          }
        }

        if ((user.balance || 0) < postPrice)
          throw new Error("NOT_ENOUGH_BALANCE");

        await db.User.update(
          { balance: (user.balance || 0) - postPrice },
          { where: { id: userId }, transaction },
        );
        await db.Transaction.create(
          {
            id: generateId(),
            userId,
            amount: postPrice,
            type: "payment",
            content: `Thanh toán phí đăng tin ${star > 0 ? "VIP " + star : "thường"} - Mã tin: ${postId.slice(0, 8)}`,
            status: "success",
          },
          { transaction },
        );

        await syncProvince(body.provinceId, body.provinceName, transaction);
        await syncDistrict(
          body.districtId,
          body.districtName,
          body.provinceId,
          transaction,
        );

        const isAutoApproved = await shouldPostBeAutoApproved(body, userId);
        const initialStatus = isAutoApproved ? "active" : "pending";

        const overviewCode = `#${Math.floor(Math.random() * 1000000)}`;
        const type = formatCategoryType(body.categoryCode);
        const target = body.target || "Tất cả";
        const bonus = star > 0 ? `Tin VIP ${star}` : "Tin thường";
        const published = moment().format("DD/MM/YYYY");
        const expired = moment().add(duration, "days").format("DD/MM/YYYY");

        await db.Post.create(
          {
            id: postId,
            title: body.title,
            address: body.address,
            categoryCode: body.categoryCode,
            description: buildPostDescription(body.description),
            provinceCode: body.provinceId,
            districtCode: body.districtId,
            priceNumber: body.priceNumber || 0,
            areaNumber: body.areaNumber || 0,
            star: body.star || 0,
            status: initialStatus,
            userId,

            sourcePostRef: overviewCode,
            type,
            target,
            bonus,
            published,
            expired,
          },
          { transaction },
        );

        if (body.images && body.images.length > 0) {
          const imageRecords = body.images.map((img) => ({
            id: generateId(),
            postId,
            image: img,
          }));
          await db.Image.bulkCreate(imageRecords, { transaction });
        }

        await syncPostFeatures(postId, body.features, transaction);

        // Tạo thông báo cho Admin
        const landlordName = user?.name || "Chủ trọ";
        await db.Notification.create(
          {
            id: generateId(),
            postId,
            senderId: userId,
            title:
              initialStatus === "active"
                ? "Tin đăng mới đã tự động duyệt"
                : "Tin đăng mới đang chờ duyệt",
            content:
              initialStatus === "active"
                ? `Chủ trọ ${landlordName} đã đăng tin mới #${postId.slice(0, 8).toUpperCase()} (đã được tự động duyệt).`
                : `Chủ trọ ${landlordName} đã đăng tin mới #${postId.slice(0, 8).toUpperCase()}. Vui lòng kiểm duyệt.`,
            isRead: false,
          },
          { transaction },
        );

        // Tạo thông báo cho Chủ trọ nếu được tự động duyệt
        if (initialStatus === "active") {
          await db.Notification.create(
            {
              id: generateId(),
              postId,
              senderId: null, // Gửi từ Hệ thống
              recipientId: userId, // Gửi cho chủ trọ
              title: "Tin đăng đã được duyệt tự động",
              content: `Tin đăng #${postId.slice(0, 8).toUpperCase()} "${body.title?.slice(0, 50)}${body.title?.length > 50 ? "..." : ""}" của bạn đã được hệ thống duyệt tự động thành công.`,
              isRead: false,
            },
            { transaction },
          );
        }
      });
      resolve({ err: 0, msg: "Tạo tin đăng thành công" });
    } catch (error) {
      if (error.message === "NOT_ENOUGH_BALANCE")
        resolve({ err: 2, msg: "Số dư không đủ." });
      else if (error.message === "EXCEEDED_IMAGE_LIMIT")
        resolve({
          err: 3,
          msg: "Bạn chỉ được tải lên tối đa 10 hình ảnh cho mỗi tin đăng.",
        });
      else if (error.message === "KYC_REQUIRED_EXCEEDED_POSTS")
        resolve({
          err: 4,
          msg: "Tài khoản chưa xác minh danh tính chỉ được đăng tối đa 3 bài viết. Vui lòng hoàn tất xác thực danh tính (KYC) để tiếp tục đăng tin không giới hạn.",
        });
      else reject(error);
    }
  });
