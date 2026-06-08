const { JSDOM } = require("jsdom");

const fetchHtml = async (url, retries = 3) => {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
  };

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
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
};

const scrapePostDetail = async (browser, link) => {
  // Support both (browser, link) and (link) signatures
  const targetUrl = typeof browser === "string" ? browser : link;
  const html = await fetchHtml(targetUrl);
  const dom = new JSDOM(html, { url: targetUrl });
  const document = dom.window.document;
  const window = dom.window;

  const normalize = (value) => value?.replace(/\s+/g, " ").trim() || "";
  const rows = Array.from(document.querySelectorAll(".mt-2 table tbody tr"));
  const table = rows.reduce((accumulator, row) => {
    const label = normalize(row.querySelector("td:first-child")?.textContent);
    const content = normalize(row.querySelector("td:last-child")?.textContent);
    if (label) accumulator[label] = content;
    return accumulator;
  }, {});

  const phoneElement = document.querySelector(".bg-white a[href^='tel:']");
  const zaloElement = document.querySelector(".bg-white a[href*='zalo.me']");
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
      title: normalize(document.querySelector("main header h1")?.textContent),
      star:
        document
          .querySelector("main header .badge .star")
          ?.className?.match(/\d+/)?.[0] || "0",
      class: {
        price: normalize(
          document.querySelector("main header .text-green")?.textContent,
        ),
        area: normalize(
          document.querySelector("main header .dot")?.nextElementSibling
            ?.textContent,
        ),
        updated: normalize(
          document.querySelector("main header time")?.textContent,
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
      header: normalize(document.querySelector("header + div h2")?.textContent),
      info: Array.from(document.querySelectorAll("header + div > p"))
        .map((item) => normalize(item.textContent))
        .filter(Boolean),
    },
    highLight: highlightContainer
      ? {
          title: normalize(highlightContainer.querySelector("h2")?.textContent),
          content: Array.from(
            highlightContainer.querySelectorAll(".row > .col-3 .text-body"),
          )
            .filter((item) => item.querySelector("i.green"))
            .map((item) => normalize(item.textContent))
            .filter(Boolean),
        }
      : { title: "", content: [] },
    contactInfo: {
      title: normalize(
        document.querySelector(".bg-white > div.mb-4:not(.border-bottom) h2")
          ?.textContent,
      ),
      content: {
        name: normalize(
          document.querySelector(
            ".bg-white > div.mb-4:not(.border-bottom) .ms-3 .fs-5.fw-medium",
          )?.textContent,
        ),
        phone: {
          text: normalize(phoneElement?.textContent),
          url: phoneElement?.getAttribute("href") || "",
        },
        zalo: {
          text: normalize(zaloElement?.textContent),
          url: zaloElement?.getAttribute("href") || "",
        },
      },
    },
  };
};

module.exports = {
  fetchHtml,
  scrapePostDetail,
};
