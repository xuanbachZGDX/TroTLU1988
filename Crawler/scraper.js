const DEFAULT_TIMEOUT = 120000;

const openPage = async (browser, url) => {
  const page = await browser.newPage();
  
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const resourceType = req.resourceType();
    if (['image', 'stylesheet', 'font', 'media', 'other'].includes(resourceType)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  page.setDefaultNavigationTimeout(DEFAULT_TIMEOUT);
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: DEFAULT_TIMEOUT,
  });
  return page;
};

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
            slug: href ? new URL(href).pathname.split("/").filter(Boolean).pop() || "phongtro123.com" : "",
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

  const detailLinks = await page.$$eval("main ul.post__listing > li h3 > a", (elements) =>
    Array.from(new Set(elements.map((item) => item.href).filter(Boolean))),
  );

  const nextPage = await page
    .$eval(".pagination .page-item.active + .page-item a", (element) => element.href)
    .catch(() => null);

  return { header, detailLinks, nextPage };
};

const scrapePostDetail = async (browser, link) => {
  const page = await openPage(browser, link);
  try {
    return await page.evaluate(() => {
      const normalize = (value) => value?.replace(/\s+/g, " ").trim() || "";
      const rows = Array.from(document.querySelectorAll(".mt-2 table tbody tr"));
      const table = rows.reduce((accumulator, row) => {
        const label = normalize(row.querySelector("td:first-child")?.innerText);
        const content = normalize(row.querySelector("td:last-child")?.innerText);
        if (label) accumulator[label] = content;
        return accumulator;
      }, {});

      const phoneElement = document.querySelector(".bg-white a[href^='tel:']");
      const zaloElement = document.querySelector(".bg-white a[href*='zalo.me']");
      const highlightContainer = Array.from(document.querySelectorAll(".bg-white > div")).find((item) =>
        item.querySelector(".row > .col-3 i.green"),
      );

      return {
        sourceUrl: window.location.href,
        images: Array.from(
          document.querySelectorAll("#carousel_Photos div.carousel-item img"),
        )
          .map((item) => item.getAttribute("src"))
          .filter(Boolean),
        header: {
          title: normalize(document.querySelector("main header h1")?.innerText),
          star:
            document
              .querySelector("main header .badge .star")
              ?.className?.match(/\d+/)?.[0] || "0",
          class: {
            price: normalize(document.querySelector("main header .text-green")?.innerText),
            area: normalize(
              document.querySelector("main header .dot")?.nextElementSibling?.innerText,
            ),
            updated: normalize(document.querySelector("main header time")?.innerText),
          },
          table: {
            district: { label: "Quận huyện:", content: table["Quận huyện:"] || "" },
            city: { label: "Tỉnh thành:", content: table["Tỉnh thành:"] || "" },
            address: { label: "Địa chỉ:", content: table["Địa chỉ:"] || "" },
            postId: { label: "Mã tin:", content: table["Mã tin:"] || "" },
            publishedDate: { label: "Ngày đăng:", content: table["Ngày đăng:"] || "" },
            expiredDate: { label: "Ngày hết hạn:", content: table["Ngày hết hạn:"] || "" },
          },
        },
        mainContent: {
          header: normalize(document.querySelector("header + div h2")?.innerText),
          info: Array.from(document.querySelectorAll("header + div > p"))
            .map((item) => normalize(item.innerText))
            .filter(Boolean),
        },
        highLight: highlightContainer
          ? {
              title: normalize(highlightContainer.querySelector("h2")?.innerText),
              content: Array.from(
                highlightContainer.querySelectorAll(".row > .col-3 .text-body"),
              )
                .filter((item) => item.querySelector("i.green"))
                .map((item) => normalize(item.innerText))
                .filter(Boolean),
            }
          : { title: "", content: [] },
        contactInfo: {
          title: normalize(document.querySelector(".bg-white > div.mb-4:not(.border-bottom) h2")?.innerText),
          content: {
            name: normalize(document.querySelector(".bg-white > div.mb-4:not(.border-bottom) .ms-3 .fs-5.fw-medium")?.innerText),
            phone: {
              text: normalize(phoneElement?.innerText),
              url: phoneElement?.getAttribute("href") || "",
            },
            zalo: {
              text: normalize(zaloElement?.innerText),
              url: zaloElement?.getAttribute("href") || "",
            },
          },
        },
      };
    });
  } finally {
    await page.close();
  }
};

const scraper = async (browser, url, options = {}) => {
  const maxPages = Number(options.maxPages || process.env.SCRAPE_MAX_PAGES || 1);
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
        await listingPage.goto(currentUrl, {
          waitUntil: "domcontentloaded",
          timeout: DEFAULT_TIMEOUT,
        });
      }

      const pageData = await scrapeListingPage(listingPage);
      if (currentPage === 1) categoryHeader = pageData.header;

      const postLinks = pageData.detailLinks.filter(link => !visitedLinks.has(link));
      postLinks.forEach(link => visitedLinks.add(link));

      const CHUNK_SIZE = 3; 
      for (let i = 0; i < postLinks.length; i += CHUNK_SIZE) {
        const chunk = postLinks.slice(i, i + CHUNK_SIZE);
        const chunkResults = await Promise.all(chunk.map(link => scrapePostDetail(browser, link).catch(err => {
          console.warn(`Lỗi khi scrape ${link}:`, err.message);
          return null; 
        })));
        details.push(...chunkResults.filter(Boolean));
      }

      currentUrl = pageData.nextPage && !visitedListingUrls.has(pageData.nextPage) ? pageData.nextPage : null;
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
