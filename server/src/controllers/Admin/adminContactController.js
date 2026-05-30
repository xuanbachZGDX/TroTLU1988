import * as adminService from "../../services/Admin/adminService";

export const getContacts = async (req, res) => {
  try {
    const response = await adminService.getAdminContactsService();
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at admin controller: " + error });
  }
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  try {
    const response = await adminService.deleteAdminContactService(contactId);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at admin controller: " + error });
  }
};

export const replyContact = async (req, res) => {
  const { contactId } = req.params;
  const { responseText } = req.body;
  try {
    if (!contactId || !responseText) {
      return res
        .status(400)
        .json({ err: 1, msg: "Missing required parameters" });
    }
    const response = await adminService.replyAdminContactService(
      contactId,
      responseText,
    );
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at admin controller: " + error });
  }
};
