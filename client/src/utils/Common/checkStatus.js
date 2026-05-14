export const checkStatus = (dateString) => {
  if (!dateString) return "Chưa xác định";
  
  let cleanDate = dateString;
  if (dateString.includes(',')) {
    const parts = dateString.split(' ');
    cleanDate = parts[parts.length - 1]; 
  }

  const dateParts = cleanDate.split('/');
  if (dateParts.length !== 3) return "Đang hoạt động";

  const [d, m, y] = dateParts;
  const expiredDate = new Date(y, m - 1, d, 23, 59, 59);
  const now = new Date();
  
  if (isNaN(expiredDate.getTime())) return "Đang hoạt động";

  return expiredDate.getTime() >= now.getTime() ? "Đang hoạt động" : "Đã hết hạn";
};
