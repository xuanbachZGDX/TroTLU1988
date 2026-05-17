import fs from 'fs';
import path from 'path';

const getSettingsPath = () => {
  const dir = path.join(__dirname, '../config');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, 'systemSettings.json');
};

export const getSystemSettings = () => {
  try {
    const settingsPath = getSettingsPath();
    if (!fs.existsSync(settingsPath)) {
      fs.writeFileSync(settingsPath, JSON.stringify({ autoApprove: false }));
    }
    const data = fs.readFileSync(settingsPath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return { autoApprove: false };
  }
};

export const updateSystemSettings = (settings) => {
  try {
    const settingsPath = getSettingsPath();
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    return true;
  } catch (e) {
    return false;
  }
};
