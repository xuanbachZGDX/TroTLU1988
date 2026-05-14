import db from "../../models";
import moment from "moment";

export const getDashboardService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const [totalPosts, totalUsers, allOverviews, totalRevenue] = await Promise.all([
        db.Post.count(),
        db.User.count(),
        db.Overview.findAll({ attributes: ['expired'], raw: true }),
        db.Transaction.sum('amount', { where: { status: 'success', type: 'payment' } })
      ]);

      const today = moment().startOf('day');
      let expiredPosts = 0;
      let activePosts = 0;

      allOverviews.forEach(ov => {
        let dateStr = ov.expired;
        if (dateStr && dateStr.includes(',')) dateStr = dateStr.split(' ').pop();
        const expDate = moment(dateStr, "DD/MM/YYYY");
        if (expDate.isValid() && expDate.isBefore(today)) expiredPosts++;
        else activePosts++;
      });

      resolve({ err: 0, msg: "OK", response: { totalPosts, activePosts, expiredPosts, totalUsers, totalRevenue: totalRevenue || 0 } });
    } catch (error) {
      reject(error);
    }
  });
