const scrappers = require("./scraper");
const fs = require("fs");

const scrapeController = async (browserInstance) => {
  const url = "https://phongtro123.com/";
  const propertyIndex = [0, 1, 2, 3, 4, 5, 6];
  try {
    let browser = await browserInstance; 

    const categories = await scrappers.scrapeCategory(browser, url);
    const selectedCategories = categories.filter((category, index) =>
      propertyIndex.includes(index),
    );

    for (let category of selectedCategories) {
      console.log(`>> Đang thu thập dữ liệu cho danh mục: ${category.link}...`);
      let result = await scrappers.scraper(browser, category.link);

      let fileName = category.link.split("/").filter(Boolean).pop();
      fs.writeFileSync(`${fileName}.json`, JSON.stringify(result, null, 2));
    }

    await browser.close();
  } catch (error) {
    console.log("Bug in scrape controller: ", error);
  }
};
module.exports = scrapeController;
