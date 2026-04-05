const scrapeCategory = (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      let page = await browser.newPage();
      console.log(">> Mở tab mới...");
      await page.goto(url);
      console.log(">> Đang truy cập vào trang: ", url);
      await page.waitForSelector("#webpage");
      console.log(">> Webpage loaded...");

      const dataCategory = await page.$$eval(
        ".pt123__nav > ul > li",
        (elements) => {
          return elements.map((item) => {
            const aTag = item.querySelector("a");
            return {
              category: aTag?.innerText?.trim() || "",
              link: aTag?.href || "",
            };
          });
        },
      );

      await page.close();
      console.log(">> Tab đã đóng...");
      resolve(dataCategory);
    } catch (error) {
      console.log("Bug in scrape category: ", error);
      reject(error);
    }
  });

const scraper = (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      let newPage = await browser.newPage();
      console.log(">> Mở tab mới...");
      await newPage.goto(url);
      console.log(">> Đang truy cập vào trang: ", url);
      await newPage.waitForSelector("main header");
      console.log(">> Webpage loaded tag main...");

      const scrapeData = {};

      // Lấy header
      const headerData = await newPage.$eval("main header", (elements) => {
        return {
          title: elements.querySelector("h1")?.innerText?.trim() || "",
          description: elements.querySelector("p")?.innerText?.trim() || "",
        };
      });

      scrapeData.header = headerData;

      // Lấy link detail item
      const detailLinks = await newPage.$$eval(
        "main ul.post__listing > li",
        (elements) => {
          detailLinks = elements.map((item) => {
            return item.querySelector("h3 > a").href;
          });
          return detailLinks;
        },
      );

      // console.log(detailLinks);

      const scrapeDetail = async (link) =>
        new Promise(async (resolve, reject) => {
          try {
            let pageDetail = await browser.newPage();
            await pageDetail.goto(link);
            console.log(">> Truy cập: ", link);
            await pageDetail.waitForSelector("main");

            const detailData = {};

            // Cào data
            // Cào ảnh
            const images = await pageDetail.$$eval(
              "#carousel_Photos div.carousel-item",
              (items) => {
                return items.map((item) => {
                  const img = item.querySelector("img");
                  return img ? img.src : null;
                });
              },
            );

            detailData.images = images;

            // Lấy header detail
            const header = await pageDetail.$eval("main header", (ele) => {
              const rows = document.querySelectorAll(".mt-2 table tbody tr");
              return {
                title: ele.querySelector("h1")?.innerText?.trim() || "",
                star:
                  ele
                    .querySelector(".badge .star")
                    ?.className?.match(/\d+/)?.[0] || "",
                class: {
                  price:
                    ele.querySelector(".text-green")?.innerText?.trim() || "",
                  area:
                    ele
                      .querySelector(".dot")
                      ?.nextElementSibling?.innerText?.trim() || "",
                  updated: ele.querySelector("time")?.innerText?.trim() || "",
                },
                table: {
                  // Quận huyện
                  district: {
                    label:
                      rows[0]
                        ?.querySelector("td:first-child")
                        ?.innerText?.trim() || "",
                    content:
                      rows[0]
                        ?.querySelector("td:last-child")
                        ?.innerText?.trim() || "",
                  },
                  // Tỉnh thành
                  city: {
                    label:
                      rows[1]
                        ?.querySelector("td:first-child")
                        ?.innerText?.trim() || "",
                    content:
                      rows[1]
                        ?.querySelector("td:last-child")
                        ?.innerText?.trim() || "",
                  },
                  // Địa chỉ
                  address: {
                    label:
                      rows[2]
                        ?.querySelector("td:first-child")
                        ?.innerText?.trim() || "",
                    content:
                      rows[2]
                        ?.querySelector("td:last-child")
                        ?.innerText?.trim() || "",
                  },
                  // Mã tin
                  postId: {
                    label:
                      rows[3]
                        ?.querySelector("td:first-child")
                        ?.innerText?.trim() || "",
                    content:
                      rows[3]
                        ?.querySelector("td:last-child")
                        ?.innerText?.trim() || "",
                  },
                  // Ngày đăng
                  publishedDate: {
                    label:
                      rows[4]
                        ?.querySelector("td:first-child")
                        ?.innerText?.trim() || "",
                    content:
                      rows[4]
                        ?.querySelector("td:last-child")
                        ?.innerText?.trim() || "",
                  },
                  // Ngày hết hạn
                  expiredDate: {
                    label:
                      rows[5]
                        ?.querySelector("td:first-child")
                        ?.innerText?.trim() || "",
                    content:
                      rows[5]
                        ?.querySelector("td:last-child")
                        ?.innerText?.trim() || "",
                  },
                },
              };
            });

            detailData.header = header;

            // Thông tin mô tả
            const description = await pageDetail.$eval(
              "header + div",
              (ele) => ele.querySelector("h2")?.innerText?.trim() || "",
            );

            const infoDescription = await pageDetail.$$eval(
              "header + div > p",
              (ele) => ele.map((item) => item.innerText.trim()),
            );

            detailData.mainContent = {
              header: description,
              info: infoDescription,
            };

            // Nổi bật
            const highLight = await pageDetail
              .$eval(".bg-white > div:has(.row > .col-3 i.green)", (ele) => {
                return {
                  title: ele.querySelector("h2")?.innerText?.trim() || "",

                  content: Array.from(
                    ele.querySelectorAll(".row > .col-3 .text-body"),
                  )
                    .filter((item) => item.querySelector("i.green"))
                    .map((item) => item.innerText.trim()),
                };
              })
              .catch(() => ({
                title: "",
                content: [],
              }));

            detailData.highLight = highLight;

            // Thông tin liên hệ
            const contactInfo = await pageDetail
              .$eval(".bg-white > div.mb-4:not(.border-bottom)", (ele) => {
                // Khai báo sẵn các phần tử để tái sử dụng, đỡ phải querySelector nhiều lần
                const phoneEle = ele.querySelector("a[href^='tel:']");
                const zaloEle = ele.querySelector("a[href*='zalo.me']");

                return {
                  title: ele.querySelector("h2")?.innerText?.trim() || "",

                  content: {
                    name:
                      ele
                        .querySelector(".ms-3 .fs-5.fw-medium")
                        ?.innerText?.trim() || "",

                    // Lấy cả text hiển thị và link gốc cho Số điện thoại
                    phone: {
                      text: phoneEle?.innerText?.trim() || "",
                      url: phoneEle?.getAttribute("href") || "",
                    },

                    // Lấy cả text hiển thị và link gốc cho Zalo
                    zalo: {
                      text: zaloEle?.innerText?.trim() || "",
                      url: zaloEle?.getAttribute("href") || "",
                    },
                  },
                };
              })
              .catch(() => ({
                title: "",
                content: {
                  name: "",
                  phone: { text: "", url: "" },
                  zalo: { text: "", url: "" },
                },
              }));

            detailData.contactInfo = contactInfo;

            await pageDetail.close();
            console.log(">> Tab detail đã đóng...", link);

            resolve(detailData);
          } catch (error) {
            console.log("Bug in scrape detail: ", error);
            reject(error);
          }
        });

      const details = [];
      for (let link of detailLinks) {
        const detail = await scrapeDetail(link);
        details.push(detail);
      }

      scrapeData.body = details;

      console.log(">> Trình duyệt đã đóng...");
      resolve(scrapeData);
    } catch (error) {
      reject(error);
    }
  });

module.exports = {
  scrapeCategory,
  scraper,
};
