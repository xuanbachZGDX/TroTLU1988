export const formatDateVN = (dateString) => {
  if (!dateString) return "Chưa cập nhật";
  
  let timeObj;
  
  if (dateString.includes(',')) {
    const parts = dateString.split(' ');
    const datePart = parts[parts.length - 1];
    const [d, m, y] = datePart.split('/');
    timeObj = new Date(y, m - 1, d);
  } 
  else if (dateString.includes('/')) {
    const parts = dateString.split(' ');
    const datePart = parts.find(p => p.includes('/'));
    const timePart = parts.find(p => p.includes(':'));
    const [d, m, y] = datePart.split('/');
    if (timePart) {
      const [h, min] = timePart.split(':');
      timeObj = new Date(y, m - 1, d, h, min);
    } else {
      timeObj = new Date(y, m - 1, d);
    }
  }
  else {
    timeObj = new Date(dateString);
  }
  
  if (isNaN(timeObj.getTime())) return dateString; 

  let dayName = timeObj.getDay() === 0 ? "Chủ nhật" : `Thứ ${timeObj.getDay() + 1}`;
  let d = timeObj.getDate().toString().padStart(2, '0');
  let m = (timeObj.getMonth() + 1).toString().padStart(2, '0');
  let y = timeObj.getFullYear();
  let time = `${timeObj.getHours().toString().padStart(2, '0')}:${timeObj.getMinutes().toString().padStart(2, '0')}`;
  
  return `${dayName}, ${time} ${d}/${m}/${y}`;
};
