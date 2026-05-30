import db from "../models";
import moment from "moment";
import { Op } from "sequelize";
import { sweepPendingPostsService } from "../services/Admin/adminPostService";

export const expirePostsJob = async () => {
  try {
    const today = moment().startOf("day");
    const activePosts = await db.Post.findAll({
      attributes: ["id", "expired"],
      where: { status: "active" },
    });

    const expiredIds = activePosts
      .filter((post) => {
        const dateStr = post.expired;
        if (!dateStr) return false;
        const parts = dateStr.trim().split(" ");
        const lastPart = parts[parts.length - 1];
        const expDate = moment(lastPart, "DD/MM/YYYY");
        return expDate.isValid() && expDate.isBefore(today);
      })
      .map((post) => post.id);

    if (expiredIds.length > 0) {
      const [updatedCount] = await db.Post.update(
        { status: "expired" },
        { where: { id: expiredIds } },
      );
      console.log(
        `[postScheduler] Automatically moved ${updatedCount} expired posts to status 'expired'.`,
      );
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
