import db from "../../models";
import moment from "moment";

export const getDashboardService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const [totalPosts, totalUsers, allOverviews, totalRevenue, monthlyRevenue, monthlyPosts, monthlyUsers] = await Promise.all([
        db.Post.count(),
        db.User.count(),
        db.Overview.findAll({ attributes: ['expired'], raw: true }),
        db.Transaction.sum('amount', { where: { status: 'success', type: 'payment' } }),
        db.Transaction.findAll({
          attributes: [
            [db.sequelize.fn('MONTH', db.sequelize.col('createdAt')), 'month'],
            [db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), 'year'],
            [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'revenue']
          ],
          where: { type: 'payment', status: 'success' },
          group: [db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), db.sequelize.fn('MONTH', db.sequelize.col('createdAt'))],
          order: [[db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), 'ASC'], [db.sequelize.fn('MONTH', db.sequelize.col('createdAt')), 'ASC']],
          raw: true
        }),
        db.Post.findAll({
          attributes: [
            [db.sequelize.fn('MONTH', db.sequelize.col('createdAt')), 'month'],
            [db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), 'year'],
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
          ],
          group: [db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), db.sequelize.fn('MONTH', db.sequelize.col('createdAt'))],
          order: [[db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), 'ASC'], [db.sequelize.fn('MONTH', db.sequelize.col('createdAt')), 'ASC']],
          raw: true
        }),
        db.User.findAll({
          attributes: [
            [db.sequelize.fn('MONTH', db.sequelize.col('createdAt')), 'month'],
            [db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), 'year'],
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
          ],
          group: [db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), db.sequelize.fn('MONTH', db.sequelize.col('createdAt'))],
          order: [[db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), 'ASC'], [db.sequelize.fn('MONTH', db.sequelize.col('createdAt')), 'ASC']],
          raw: true
        })
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

      resolve({
        err: 0,
        msg: "OK",
        response: {
          totalPosts,
          activePosts,
          expiredPosts,
          totalUsers,
          totalRevenue: totalRevenue || 0,
          monthlyRevenue: monthlyRevenue || [],
          monthlyPosts: monthlyPosts || [],
          monthlyUsers: monthlyUsers || []
        }
      });
    } catch (error) {
      reject(error);
    }
  });
