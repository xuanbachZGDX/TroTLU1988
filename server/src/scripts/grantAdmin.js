import { Op } from "sequelize";
import db from "../models";

const identifier = process.argv[2];

const grantAdmin = async () => {
  if (!identifier) {
    console.error("Usage: npm run grant:admin -- <phone-or-user-id>");
    process.exitCode = 1;
    return;
  }

  try {
    const user = await db.User.findOne({
      where: {
        [Op.or]: [{ phone: identifier }, { id: identifier }],
      },
    });

    if (!user) {
      console.error("User not found.");
      process.exitCode = 1;
      return;
    }

    await user.update({ role: "admin" });
    console.log(`Granted admin role for user: ${user.name} (${user.id})`);
  } catch (error) {
    console.error("Grant admin failed:", error);
    process.exitCode = 1;
  } finally {
    await db.sequelize.close();
  }
};

grantAdmin();
