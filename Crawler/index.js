const startBrowser = require("./browser");
const scrapeController = require("./scrapeController");

let browser = startBrowser();
scrapeController(browser).catch((error) => {
  console.error("Scrape process failed:", error);
  process.exitCode = 1;
});
