const fs = require("fs");
const path = require("path");
const scrapers = require("./scraper");

const DATA_DIRECTORY = path.resolve(__dirname, "..", "server", "data");
const DEFAULT_CATEGORY_LIMIT = 7;

const resolveFileName = (category) => {
  if (category.slug) return `${category.slug}.json`;
  const pathname = new URL(category.link).pathname.split("/").filter(Boolean);
  return `${pathname.pop() || "TroTLU1988.com"}.json`;
};

const scrapeController = async () => {
  const url = "https://phongtro123.com/";

  try {
    const categories = await scrapers.scrapeCategory(url);
    const selectedCategories = categories.slice(0, DEFAULT_CATEGORY_LIMIT);
    let savedCount = 0;

    fs.mkdirSync(DATA_DIRECTORY, { recursive: true });

    for (const category of selectedCategories) {
      console.log(`Scraping category: ${category.link}`);
      try {
        const result = await scrapers.scraper(category.link, {
          maxPages: process.env.SCRAPE_MAX_PAGES || 3,
        });

        const payload = {
          ...result,
          category: {
            title: category.category,
            link: category.link,
            slug: category.slug,
          },
        };

        const fileName = resolveFileName(category);
        const outputPath = path.join(DATA_DIRECTORY, fileName);
        fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), "utf8");
        console.log(`Saved: ${outputPath}`);
        savedCount++;
      } catch (err) {
        console.error(
          `Failed to scrape category ${category.link}:`,
          err.message,
        );
      }
    }

    console.log(
      `Scrape completed successfully. Saved ${savedCount} category files to ${DATA_DIRECTORY}`,
    );
    return {
      savedCount,
      outputDirectory: DATA_DIRECTORY,
    };
  } catch (error) {
    console.log("Bug in scrape controller: ", error);
    throw error;
  }
};

module.exports = scrapeController;
