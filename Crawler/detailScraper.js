const DEFAULT_TIMEOUT = 30000;

const openPage = async (browser, url, retries = 3) => {
  const page = await browser.newPage();
  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );
    await page.setExtraHTTPHeaders({
      "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
    });

    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const reqUrl = req.url();
      const resourceType = req.resourceType();

      // Abort non-essential resource types to save bandwidth
      if (["image", "media", "font"].includes(resourceType)) {
        return req.abort();
      }

      // Block third-party tracking, ads, and widgets to prevent page hangs
      try {
        const parsedUrl = new URL(reqUrl);
        if (!parsedUrl.hostname.includes("phongtro123.com")) {
          return req.abort();
        }
      } catch (e) {
        return req.abort();
      }

      req.continue();
    });

    page.setDefaultNavigationTimeout(DEFAULT_TIMEOUT);

    for (let i = 0; i < retries; i++) {
      try {
        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: DEFAULT_TIMEOUT,
        });
        return page;
      } catch (error) {
        if (i === retries - 1) {
          throw error;
        }
        console.warn(
          `Lần thử ${i + 1} thất bại cho ${url}. Thử lại sau 2s... Lỗi: ${error.message}`,
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  } catch (error) {
    await page.close();
    throw error;
  }
};

const scrapePostDetail = async (browser, link) => {
  const page = await openPage(browser, link);
  try {
    return await page.evaluate(() => {
      const normalize = (value) => value?.replace(/\s+/g, " ").trim() || "";
      const rows = Array.from(
        document.querySelectorAll(".mt-2 table tbody tr"),
      );
      const table = rows.reduce((accumulator, row) => {
        const label = normalize(row.querySelector("td:first-child")?.innerText);
        const content = normalize(
          row.querySelector("td:last-child")?.innerText,
        );
        if (label) accumulator[label] = content;
        return accumulator;
      }, {});

      const phoneElement = document.querySelector(".bg-white a[href^='tel:']");
      const zaloElement = document.querySelector(
        ".bg-white a[href*='zalo.me']",
      );
      const highlightContainer = Array.from(
        document.querySelectorAll(".bg-white > div"),
      ).find((item) => item.querySelector(".row > .col-3 i.green"));

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
            price: normalize(
              document.querySelector("main header .text-green")?.innerText,
            ),
            area: normalize(
              document.querySelector("main header .dot")?.nextElementSibling
                ?.innerText,
            ),
            updated: normalize(
              document.querySelector("main header time")?.innerText,
            ),
          },
          table: {
            district: {
              label: "Quận huyện:",
              content: table["Quận huyện:"] || "",
            },
            city: { label: "Tỉnh thành:", content: table["Tỉnh thành:"] || "" },
            address: { label: "Địa chỉ:", content: table["Địa chỉ:"] || "" },
            postId: { label: "Mã tin:", content: table["Mã tin:"] || "" },
            publishedDate: {
              label: "Ngày đăng:",
              content: table["Ngày đăng:"] || "",
            },
            expiredDate: {
              label: "Ngày hết hạn:",
              content: table["Ngày hết hạn:"] || "",
            },
          },
        },
        mainContent: {
          header: normalize(
            document.querySelector("header + div h2")?.innerText,
          ),
          info: Array.from(document.querySelectorAll("header + div > p"))
            .map((item) => normalize(item.innerText))
            .filter(Boolean),
        },
        highLight: highlightContainer
          ? {
              title: normalize(
                highlightContainer.querySelector("h2")?.innerText,
              ),
              content: Array.from(
                highlightContainer.querySelectorAll(".row > .col-3 .text-body"),
              )
                .filter((item) => item.querySelector("i.green"))
                .map((item) => normalize(item.innerText))
                .filter(Boolean),
            }
          : { title: "", content: [] },
        contactInfo: {
          title: normalize(
            document.querySelector(
              ".bg-white > div.mb-4:not(.border-bottom) h2",
            )?.innerText,
          ),
          content: {
            name: normalize(
              document.querySelector(
                ".bg-white > div.mb-4:not(.border-bottom) .ms-3 .fs-5.fw-medium",
              )?.innerText,
            ),
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

module.exports = {
  openPage,
  scrapePostDetail,
};
