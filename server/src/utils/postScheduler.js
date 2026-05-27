import db from "../models";
import moment from "moment";
import { Op } from "sequelize";
import { sweepPendingPostsService } from "../services/Admin/adminPostService";

export const expirePostsJob = async () => {
  try {
    const todayStr = moment().format("YYYY-MM-DD");
    // Find all overviews where the expired date is in the past
    const expiredOverviews = await db.Overview.findAll({
      where: db.sequelize.literal(`STR_TO_DATE(expired, '%d/%m/%Y') < '${todayStr}'`),
      attributes: ['postId'],
      raw: true
    });

    if (expiredOverviews.length > 0) {
      const expiredPostIds = expiredOverviews.map(o => o.postId);
      const [updatedCount] = await db.Post.update(
        { status: 'expired' },
        {
          where: {
            id: { [Op.in]: expiredPostIds },
            status: 'active'
          }
        }
      );
      if (updatedCount > 0) {
        console.log(`[postScheduler] Automatically moved ${updatedCount} expired posts to status 'expired'.`);
      }
    }
  } catch (error) {
    console.error("[postScheduler] Error running expirePostsJob:", error);
  }
};

export const autoApprovePostsJob = async () => {
  try {
    const result = await sweepPendingPostsService();
    if (result && result.approvedCount > 0) {
      console.log(`[postScheduler] ${result.msg}`);
    }
  } catch (error) {
    console.error("[postScheduler] Error running autoApprovePostsJob:", error);
  }
};

export const startScheduler = () => {
  // Run on startup
  expirePostsJob();
  autoApprovePostsJob();
  
  // Run every hour (3600000ms) for post expiration
  setInterval(expirePostsJob, 60 * 60 * 1000);

  // Run every 1 minute (60000ms) for auto-approval of VIP & trusted landlord posts
  setInterval(autoApprovePostsJob, 60 * 1000);
};
