const { openPage, scrapePostDetail } = require("./detailScraper");

const DEFAULT_TIMEOUT = 30000;

const scrapeCategory = async (browser, url) => {
  const page = await openPage(browser, url);
  try {
    await page.waitForSelector("#webpage", { timeout: DEFAULT_TIMEOUT });

    return await page.$$eval(".pt123__nav > ul > li", (elements) =>
      elements
        .map((item) => {
          const link = item.querySelector("a");
          const href = link?.href?.trim() || "";
          return {
            category: link?.innerText?.trim() || "",
            link: href,
            slug: href
              ? new URL(href).pathname.split("/").filter(Boolean).pop() ||
                "TroTLU1988.com"
              : "",
          };
        })
        .filter((item) => item.link),
    );
  } finally {
    await page.close();
  }
};

const scrapeListingPage = async (page) => {
  await page.waitForSelector("main", { timeout: DEFAULT_TIMEOUT });

  const header = await page.$eval("main header", (element) => ({
    title: element.querySelector("h1")?.innerText?.trim() || "",
    description: element.querySelector("p")?.innerText?.trim() || "",
  }));

  const detailLinks = await page.$$eval(
    "main ul.post__listing > li h3 > a",
    (elements) =>
      Array.from(new Set(elements.map((item) => item.href).filter(Boolean))),
  );

  const nextPage = await page
    .$eval(
      ".pagination .page-item.active + .page-item a",
      (element) => element.href,
    )
    .catch(() => null);

  return { header, detailLinks, nextPage };
};

const scraper = async (browser, url, options = {}) => {
  const maxPages = Number(
    options.maxPages || process.env.SCRAPE_MAX_PAGES || 1,
  );
  const listingPage = await openPage(browser, url);

  try {
    const details = [];
    const visitedLinks = new Set();
    const visitedListingUrls = new Set();
    let currentUrl = url;
    let currentPage = 1;
    let categoryHeader = { title: "", description: "" };

    while (currentUrl && currentPage <= maxPages) {
      visitedListingUrls.add(currentUrl);

      if (currentPage > 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // sleep 1s between page listings
        await listingPage.goto(currentUrl, {
          waitUntil: "domcontentloaded",
          timeout: DEFAULT_TIMEOUT,
        });
      }

      const pageData = await scrapeListingPage(listingPage);
      if (currentPage === 1) categoryHeader = pageData.header;

      const postLinks = pageData.detailLinks.filter(
        (link) => !visitedLinks.has(link),
      );
      postLinks.forEach((link) => visitedLinks.add(link));

      const CHUNK_SIZE = 2; // Concurrency of 2 is safe and twice as fast now that loading is optimized
      for (let i = 0; i < postLinks.length; i += CHUNK_SIZE) {
        const chunk = postLinks.slice(i, i + CHUNK_SIZE);
        const chunkResults = await Promise.all(
          chunk.map(async (link) => {
            // Random delay between 1500ms and 3000ms to mimic human browsing behavior
            const randomDelay = Math.floor(Math.random() * 1500) + 1500;
            await new Promise((resolve) => setTimeout(resolve, randomDelay));
            return scrapePostDetail(browser, link).catch((err) => {
              console.warn(`Lỗi khi scrape ${link}:`, err.message);
              return null;
            });
          }),
        );
        details.push(...chunkResults.filter(Boolean));
      }

      currentUrl =
        pageData.nextPage && !visitedListingUrls.has(pageData.nextPage)
          ? pageData.nextPage
          : null;
      currentPage += 1;
    }

    return {
      header: categoryHeader,
      metadata: {
        sourceUrl: url,
        scrapedAt: new Date().toISOString(),
        pages: Math.min(currentPage - 1, maxPages),
        totalPosts: details.length,
      },
      body: details,
    };
  } finally {
    await listingPage.close();
  }
};

module.exports = {
  scrapeCategory,
  scraper,
};
