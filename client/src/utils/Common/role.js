export const normalizeRole = (role) => {
  const normalized = String(role || "").trim().toLowerCase();

  if (normalized === "admin") return "admin";
  if (["landlord", "shop", "owner"].includes(normalized)) return "landlord";

  return "user";
};

export const getRoleFromToken = (token) => {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));

    return normalizeRole(payload?.role);
  } catch {
    return null;
  }
};
