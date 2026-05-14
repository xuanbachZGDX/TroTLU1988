const validate = (payload, setInvalidFields) => {
  let invalids = [];
  let fields = Object.entries(payload);

  fields.forEach((item) => {
    if (["province", "features", "star", "postId", "attributeId", "imageId", "overviewId", "priceCode", "areaCode"].includes(item[0])) return;

    if (item[1] === "" || (Array.isArray(item[1]) && item[1].length === 0)) {
      let message = "Trường này không được để trống.";
      if (item[0] === 'priceNumber') message = "Bạn chưa nhập giá phòng";
      else if (item[0] === 'areaNumber') message = "Bạn chưa nhập diện tích";
      else if (item[0] === 'address') message = "Chưa chọn khu vực đăng tin";
      else if (item[0] === 'title') message = "Tiêu đề không được để trống";
      else if (item[0] === 'description') message = "Bạn chưa nhập nội dung";
      else if (item[0] === 'images') message = "Chưa tải ảnh lên";
      else if (item[0] === 'categoryCode') message = "Chưa chọn loại chuyên mục";
      
      let invalidObj = {
        name: item[0],
        message: message,
      };
      invalids.push(invalidObj);
    }
  });
  fields.forEach((item) => {
    switch (item[0]) {
      case "password":
        if (item[1].length < 6) {
          let invalidObj = {
            name: item[0],
            message: "Mật khẩu phải có ít nhất 6 ký tự.",
          };
          invalids.push(invalidObj);
        }
        break;

      case "phone":
        if (item[1] !== "") {
          if (!/^\d+$/.test(item[1])) {
            let invalidObj = {
              name: item[0],
              message: "Số điện thoại chỉ được chứa các chữ số.",
            };
            invalids.push(invalidObj);
          } else if (item[1].length < 10) {
            let invalidObj = {
              name: item[0],
              message: "Số điện thoại phải có ít nhất 10 chữ số.",
            };
            invalids.push(invalidObj);
          }
        }
        break;

      case "priceNumber":
      case "areaNumber":
        if (item[1] !== "" && !+item[1]) {
          let invalidObj = {
            name: item[0],
            message: "Trường này phải là một số hợp lệ (lớn hơn 0).",
          };
          invalids.push(invalidObj);
        }
        break;
      case "title":
        if (item[1] && item[1].length < 30) {
          let invalidObj = {
            name: item[0],
            message: "Tiêu đề phải có ít nhất 30 ký tự.",
          };
          invalids.push(invalidObj);
        }
        break;
      case "description":
        if (item[1] && item[1].length < 50) {
          let invalidObj = {
            name: item[0],
            message: "Nội dung mô tả phải có ít nhất 50 ký tự.",
          };
          invalids.push(invalidObj);
        }
        break;

      default:
        break;
    }
  });

  setInvalidFields(invalids);
  return invalids;
};

export default validate;
