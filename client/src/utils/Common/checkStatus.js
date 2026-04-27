export const checkStatus = (dateString) => {
  if (!dateString) return "Chưa cập nhật";
  const now = new Date();
  const expiredDate = new Date(dateString);
  
  if (expiredDate.getTime() >= now.getTime()) {
    return "Đang hoạt động";
  } else {
    return "Đã hết hạn";
  }
};
