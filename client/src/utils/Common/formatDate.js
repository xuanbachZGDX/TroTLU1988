export const formatDateVN = (dateString) => {
  if (!dateString) return "Chưa cập nhật";
  const timeObj = new Date(dateString);
  let day = timeObj.getDay() === 0 ? "Chủ nhật" : `Thứ ${timeObj.getDay() + 1}`;
  let date = `${timeObj.getDate()}/${timeObj.getMonth() + 1}/${timeObj.getFullYear()}`;
  let time = `${timeObj.getHours().toString().padStart(2, '0')}:${timeObj.getMinutes().toString().padStart(2, '0')}`;
  return `${day}, ${time} ${date}`;
};
