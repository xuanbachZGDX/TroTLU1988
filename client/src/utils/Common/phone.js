export const normalizePhone = (rawPhone) => {
  if (!rawPhone) return "";
  let normalized = rawPhone.replace(/[\s\-\(\)]/g, "");
  if (normalized.startsWith("+84")) {
    normalized = "0" + normalized.slice(3);
  } else if (normalized.startsWith("84") && normalized.length > 9) {
    normalized = "0" + normalized.slice(2);
  }
  return normalized;
};
