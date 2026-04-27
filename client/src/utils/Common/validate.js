const validate = (payload, setInvalidFields) => {
  let invalids = 0;
  let fields = Object.entries(payload);

  fields.forEach((item) => {
    if (item[1] === "") {
      let message = "Trường này không được để trống.";
      if (item[0] === 'priceNumber') message = "Bạn chưa nhập giá phòng";
      else if (item[0] === 'areaNumber') message = "Bạn chưa nhập diện tích";
      else if (item[0] === 'address') message = "Chưa chọn khu vực đăng tin";
      else if (item[0] === 'title') message = "Tiêu đề không được để trống";
      else if (item[0] === 'description') message = "Bạn chưa nhập nội dung";
      
      setInvalidFields((prev) => [
        ...prev,
        {
          name: item[0],
          message: message,
        },
      ]);
      invalids++;
    }
  });
  fields.forEach((item) => {
    switch (item[0]) {
      case "password":
        if (item[1].length < 6) {
          setInvalidFields((prev) => [
            ...prev,
            {
              name: item[0],
              message: "Mật khẩu phải có ít nhất 6 ký tự.",
            },
          ]);
          invalids++;
        }
        break;

        if (item[1] !== "" && !+item[1]) {
          setInvalidFields((prev) => [
            ...prev,
            {
              name: item[0],
              message: "Số điện thoại không hợp lệ.",
            },
          ]);
          invalids++;
        }
        break;

      case "priceNumber":
      case "areaNumber":
        if (item[1] !== "" && !+item[1]) {
          setInvalidFields((prev) => [
            ...prev,
            {
              name: item[0],
              message: "Trường này phải là một số hợp lệ (lớn hơn 0).",
            },
          ]);
          invalids++;
        }
        break;

      default:
        break;
    }
  });
  return invalids;
};

export default validate;
