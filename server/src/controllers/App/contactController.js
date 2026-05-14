import * as contactService from "../../services/App/contactService";

export const createContact = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, phone, description } = req.body;
    if (!name || !phone || !description) {
      return res.status(400).json({
        err: 1,
        msg: "Thiếu các trường bắt buộc",
      });
    }
    const response = await contactService.createContactService({ ...req.body, userId: id });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Lỗi controller: " + error,
    });
  }
};
