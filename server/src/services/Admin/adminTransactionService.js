import { Op } from "sequelize";
import db from "../../models";

export const getAdminTransactionsService = (page, query) =>
  new Promise(async (resolve, reject) => {
    try {
      const { limit: limitQuery, status, type, search } = query;
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const limit = +limitQuery || +process.env.LIMIT || 10;
      const where = {};

      if (status) where.status = status;
      if (type) where.type = type;

      const userWhere = {};
      if (search) {
        // We can search either by Transaction fields or User fields
        // To be safe with Sequelize, we can search by Transaction content/id
        // or user fields via Op.or using nested paths.
        where[Op.or] = [
          { id: { [Op.like]: `%${search}%` } },
          { content: { [Op.like]: `%${search}%` } },
          { "$user.phone$": { [Op.like]: `%${search}%` } },
          { "$user.name$": { [Op.like]: `%${search}%` } },
        ];
      }

      const response = await db.Transaction.findAndCountAll({
        where,
        limit,
        offset: offset * limit,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: db.User,
            as: "user",
            attributes: ["id", "name", "phone", "avatar"],
            where: userWhere,
            required: search ? false : false, // Do not force inner join
          },
        ],
        nest: true,
      });

      resolve({
        err: 0,
        msg: "OK",
        response: {
          count: response.count,
          rows: response.rows,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
