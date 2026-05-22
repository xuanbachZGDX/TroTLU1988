export const optimizeCloudinaryUrl = (url, options = {}) => {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com")) return url;
  
  const { width, height, quality = "auto", fetchFormat = "auto", crop = "fill" } = options;
  
  // Tìm vị trí /upload/ trong URL
  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) return url;
  
  // Xây dựng chuỗi transformation
  let transformations = `q_${quality},f_${fetchFormat}`;
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height}`;
  if (crop && (width || height)) transformations += `,c_${crop}`;
  
  // Trả về URL đã được chèn transformation
  return url.slice(0, uploadIndex + 8) + transformations + "/" + url.slice(uploadIndex + 8);
};
