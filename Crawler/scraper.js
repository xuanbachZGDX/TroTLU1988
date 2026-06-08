const { JSDOM } = require("jsdom");
const { fetchHtml, scrapePostDetail } = require("./detailScraper");

const scrapeCategory = async (browser, url) => {
  // Support both (browser, url) and (url) signatures
  const targetUrl = typeof browser === "string" ? browser : url;
  const html = await fetchHtml(targetUrl);
  const dom = new JSDOM(html, { url: targetUrl });
  const document = dom.window.document;

  return Array.from(document.querySelectorAll(".pt123__nav > ul > li"))
    .map((item) => {
      const link = item.querySelector("a");
      const href = link?.getAttribute("href")?.trim() || "";
      const fullHref = href ? new URL(href, targetUrl).href : "";
      return {
        category: link?.textContent?.trim() || "",
        link: fullHref,
        slug: fullHref
          ? new URL(fullHref).pathname.split("/").filter(Boolean).pop() ||
            "TroTLU1988.com"
          : "",
      };
    })
    .filter((item) => item.link);
};

const scraper = async (browser, url, options = {}) => {
  // Support both (browser, url, options) and (url, options) signatures
  let targetUrl = url;
  let targetOptions = options;
  if (typeof browser === "string") {
    targetUrl = browser;
    targetOptions = url || {};
  }

  const maxPages = Number(
    targetOptions.maxPages || process.env.SCRAPE_MAX_PAGES || 1,
  );

  try {
    const details = [];
    const visitedLinks = new Set();
    const visitedListingUrls = new Set();
    let currentUrl = targetUrl;
    let currentPage = 1;
    let categoryHeader = { title: "", description: "" };

    while (currentUrl && currentPage <= maxPages) {
      visitedListingUrls.add(currentUrl);

      if (currentPage > 1) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Sleep 500ms between page listings
      }

      const html = await fetchHtml(currentUrl);
      const dom = new JSDOM(html, { url: currentUrl });
      const document = dom.window.document;

      const headerElement = document.querySelector("main header");
      const header = headerElement
        ? {
            title: headerElement.querySelector("h1")?.textContent?.trim() || "",
            description:
              headerElement.querySelector("p")?.textContent?.trim() || "",
          }
        : { title: "", description: "" };

      if (currentPage === 1) {
        categoryHeader = header;
      }

      const detailLinks = Array.from(
        new Set(
          Array.from(
            document.querySelectorAll("main ul.post__listing > li h3 > a"),
          )
            .map((item) => {
              const href = item.getAttribute("href");
              return href ? new URL(href, currentUrl).href : "";
            })
            .filter(Boolean),
        ),
      );

      const postLinks = detailLinks.filter((link) => !visitedLinks.has(link));
      postLinks.forEach((link) => visitedLinks.add(link));

      // Scraping concurrency chunking (5 is safe, fast, and light with fetch)
      const CHUNK_SIZE = 5;
      for (let i = 0; i < postLinks.length; i += CHUNK_SIZE) {
        const chunk = postLinks.slice(i, i + CHUNK_SIZE);
        const chunkResults = await Promise.all(
          chunk.map(async (link) => {
            // Polite delay between 100ms and 400ms to avoid slamming the server
            const randomDelay = Math.floor(Math.random() * 300) + 100;
            await new Promise((resolve) => setTimeout(resolve, randomDelay));
            return scrapePostDetail(null, link).catch((err) => {
              console.warn(`Lỗi khi scrape ${link}:`, err.message);
              return null;
            });
          }),
        );
        details.push(...chunkResults.filter(Boolean));
      }

      const nextPageElement = document.querySelector(
        ".pagination .page-item.active + .page-item a",
      );
      const nextPage = nextPageElement
        ? new URL(nextPageElement.getAttribute("href"), currentUrl).href
        : null;

      currentUrl =
        nextPage && !visitedListingUrls.has(nextPage) ? nextPage : null;
      currentPage += 1;
    }

    return {
      header: categoryHeader,
      metadata: {
        sourceUrl: targetUrl,
        scrapedAt: new Date().toISOString(),
        pages: Math.min(currentPage - 1, maxPages),
        totalPosts: details.length,
      },
      body: details,
    };
  } catch (error) {
    console.error(`Error scraping category ${targetUrl}:`, error);
    throw error;
  }
};

module.exports = {
  scrapeCategory,
  scraper,
};
