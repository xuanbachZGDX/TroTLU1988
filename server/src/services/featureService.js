// Danh sách đặc điểm nổi bật — 1 nơi duy nhất trên toàn hệ thống
// Muốn thêm/bỏ feature: chỉ sửa mảng này
const FEATURES = [
  "Đầy đủ nội thất",
  "Có gác",
  "Có kệ bếp",
  "Có máy lạnh",
  "Có máy giặt",
  "Có tủ lạnh",
  "Có thang máy",
  "Không chung chủ",
  "Giờ giấc tự do",
  "Có bảo vệ 24/24",
  "Có hầm để xe",
  "Wifi miễn phí",
];

export const getFeaturesService = () =>
  new Promise((resolve) => {
    resolve({
      err: 0,
      msg: "OK",
      response: FEATURES,
    });
  });
