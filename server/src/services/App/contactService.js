import db from "../../models";

export const createContactService = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      await db.Contact.create({
        userId: body.userId,
        name: body.name,
        phone: body.phone,
        content: body.description,
        status: "pending",
      });
      resolve({
        err: 0,
        msg: "Gửi thông tin liên hệ thành công!",
      });
    } catch (error) {
      reject(error);
    }
  });
