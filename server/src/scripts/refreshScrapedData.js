import path from "path";
import { spawn } from "child_process";
import db from "../models";
import { insertService, createPricesAndAreas } from "../services/App/insertService";

const runCrawler = () =>
  new Promise((resolve, reject) => {
    const crawlerDirectory = path.resolve(__dirname, "../../../Crawler");
    const child = spawn(process.execPath, ["index.js"], {
      cwd: crawlerDirectory,
      stdio: "inherit",
      env: process.env,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Crawler exited with code ${code}`));
    });
  });

const refresh = async () => {
  try {
    await runCrawler();
    console.log("Scrape stage completed. Data has been saved to server/data.");
    await createPricesAndAreas();
    await insertService();
    console.log("Refresh scraped data completed.");
  } catch (error) {
    console.error("Refresh scraped data failed:", error);
    process.exitCode = 1;
  } finally {
    await db.sequelize.close();
  }
};

refresh();
