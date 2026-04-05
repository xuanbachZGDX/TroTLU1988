const puppeteer = require('puppeteer');

const startBrowser = async () => {
    let browser;
    try {
        browser = await puppeteer.launch({
            // Để là true thì trình duyệt sẽ chạy ở chế độ ẩn, không hiển thị giao diện người dùng. Nếu là false, trình duyệt sẽ hiển thị giao diện người dùng.
            headless: true, 
            args: ['--disable-setuid-sandbox'],
            'ignoreHTTPSErrors': true // truy cập website bỏ qua lỗi http secure
        })
    } catch (error) {
        console.log("Could not create a browser: ", error);
    }
    return browser;
}

module.exports = startBrowser;