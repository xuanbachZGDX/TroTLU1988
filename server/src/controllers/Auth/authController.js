import * as authService from "../../services/Auth/authService";

export const register = async (req, res) => {
  const { name, phone, password } = req.body || {};
  try {
    console.log("SERVER REGISTER RECEIVED req.body:", req.body);
    if (!name || !phone || !password)
      return res.status(400).json({
        err: 1,
        msg: "Missing inputs!",
      });

    const response = await authService.registerService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Fail at auth controller: " + error,
    });
  }
};

export const login = async (req, res) => {
  const { phone, password } = req.body || {};
  try {
    if (!phone || !password)
      return res.status(400).json({
        err: 1,
        msg: "Missing inputs!",
      });

    const response = await authService.loginService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Fail at auth controller: " + error,
    });
  }
};

export const loginGoogle = async (req, res) => {
  const { credential, accountType } = req.body;
  try {
    if (!credential)
      return res.status(400).json({
        err: 1,
        msg: "Missing Google credential!",
      });

    const response = await authService.loginGoogleService(credential, accountType);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Fail at auth controller: " + error,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email)
      return res.status(400).json({
        err: 1,
        msg: "Vui lòng nhập Email!",
      });

    const response = await authService.forgotPasswordService(email);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Fail at auth controller: " + error,
    });
  }
};

export const resetPassword = async (req, res) => {
  const { password, otp, email } = req.body;
  try {
    if (!password || !otp || !email)
      return res.status(400).json({
        err: 1,
        msg: "Thiếu thông tin mật khẩu, OTP hoặc Email!",
      });

    const response = await authService.resetPasswordService({ password, otp, email });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Fail at auth controller: " + error,
    });
  }
};

