import Joi from "joi";

// Middleware xác thực dữ liệu request body bằng schema Joi
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({
        err: 1,
        msg: `Dữ liệu không hợp lệ: ${errorMessages}`,
      });
    }
    next();
  };
};

// Biểu thức chính quy cho số điện thoại Việt Nam (10 số, bắt đầu bằng 0 hoặc 84 hoặc +84)
const phoneRegex = /^(0|\+84|84)?([0-9]{9})$/;

export const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      "string.empty": "Họ và tên không được để trống.",
      "string.min": "Họ và tên phải có ít nhất 2 ký tự.",
      "string.max": "Họ và tên không được vượt quá 50 ký tự.",
      "any.required": "Họ và tên là bắt buộc.",
    }),
    phone: Joi.string().pattern(phoneRegex).required().messages({
      "string.empty": "Số điện thoại không được để trống.",
      "string.pattern.base": "Số điện thoại không đúng định dạng Việt Nam.",
      "any.required": "Số điện thoại là bắt buộc.",
    }),
    password: Joi.string().min(6).required().messages({
      "string.empty": "Mật khẩu không được để trống.",
      "string.min": "Mật khẩu phải có ít nhất 6 ký tự.",
      "any.required": "Mật khẩu là bắt buộc.",
    }),
    accountType: Joi.string().valid("user", "landlord").required().messages({
      "string.empty": "Loại tài khoản không được để trống.",
      "any.required": "Loại tài khoản là bắt buộc.",
    }),
    role: Joi.string().optional(),
  }),

  login: Joi.object({
    phone: Joi.string().pattern(phoneRegex).required().messages({
      "string.empty": "Số điện thoại không được để trống.",
      "string.pattern.base": "Số điện thoại không đúng định dạng Việt Nam.",
      "any.required": "Số điện thoại là bắt buộc.",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Mật khẩu không được để trống.",
      "any.required": "Mật khẩu là bắt buộc.",
    }),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Email không được để trống.",
      "string.email": "Email không đúng định dạng.",
      "any.required": "Email là bắt buộc.",
    }),
  }),

  resetPassword: Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Email không được để trống.",
      "string.email": "Email không đúng định dạng.",
      "any.required": "Email là bắt buộc.",
    }),
    otp: Joi.string().required().messages({
      "string.empty": "Mã OTP không được để trống.",
      "any.required": "Mã OTP là bắt buộc.",
    }),
    password: Joi.string().min(6).required().messages({
      "string.empty": "Mật khẩu mới không được để trống.",
      "string.min": "Mật khẩu mới phải có ít nhất 6 ký tự.",
      "any.required": "Mật khẩu mới là bắt buộc.",
    }),
  }),

  createPost: Joi.object({
    categoryCode: Joi.string().required().messages({
      "string.empty": "Mã danh mục không được để trống.",
      "any.required": "Mã danh mục là bắt buộc.",
    }),
    title: Joi.string().min(5).max(100).required().messages({
      "string.empty": "Tiêu đề không được để trống.",
      "string.min": "Tiêu đề phải có ít nhất 5 ký tự.",
      "string.max": "Tiêu đề không được vượt quá 100 ký tự.",
      "any.required": "Tiêu đề là bắt buộc.",
    }),
    priceNumber: Joi.number().positive().required().messages({
      "number.base": "Giá trị giá phòng phải là số.",
      "number.positive": "Giá trị giá phòng phải lớn hơn 0.",
      "any.required": "Giá trị giá phòng là bắt buộc.",
    }),
    areaNumber: Joi.number().positive().required().messages({
      "number.base": "Giá trị diện tích phải là số.",
      "number.positive": "Giá trị diện tích phải lớn hơn 0.",
      "any.required": "Giá trị diện tích là bắt buộc.",
    }),
    address: Joi.string().allow("", null),
    description: Joi.string().allow("", null),
    provinceCode: Joi.string().allow("", null),
    districtCode: Joi.string().allow("", null),
    images: Joi.any().optional(),
    features: Joi.any().optional(),
  }).unknown(true),

  updatePost: Joi.object({
    postId: Joi.string().required().messages({
      "string.empty": "Mã bài đăng không được để trống.",
      "any.required": "Mã bài đăng là bắt buộc.",
    }),
    categoryCode: Joi.string().optional(),
    title: Joi.string().min(5).max(100).optional().messages({
      "string.min": "Tiêu đề phải có ít nhất 5 ký tự.",
      "string.max": "Tiêu đề không được vượt quá 100 ký tự.",
    }),
    priceNumber: Joi.number().positive().optional().messages({
      "number.base": "Giá trị giá phòng phải là số.",
      "number.positive": "Giá trị giá phòng phải lớn hơn 0.",
    }),
    areaNumber: Joi.number().positive().optional().messages({
      "number.base": "Giá trị diện tích phải là số.",
      "number.positive": "Giá trị diện tích phải lớn hơn 0.",
    }),
    address: Joi.string().allow("", null),
    description: Joi.string().allow("", null),
    provinceCode: Joi.string().allow("", null),
    districtCode: Joi.string().allow("", null),
    images: Joi.any().optional(),
    features: Joi.any().optional(),
  }).unknown(true),
};
