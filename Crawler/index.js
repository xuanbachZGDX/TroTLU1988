const scrapeController = require("./scrapeController");

scrapeController().catch((error) => {
  console.error("Scrape process failed:", error);
  process.exitCode = 1;
});
