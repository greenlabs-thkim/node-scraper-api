const { Parser, transforms: { unwind } } = require('json2csv');
const fs = require('fs');
const path = require('path');
const https = require('node:https');

const scraperObject = {
    url: `https://shopping.naver.com/home`,
    async sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
    },
    download: (url, file_dir) => new Promise((resolve, reject) => {
        console.log(`download url: ${url}`);
        const filename = url.substring(url.lastIndexOf('/') + 1).split('?')[0];
        fs.mkdirSync(file_dir, { recursive: true });
        const file_path = path.join(file_dir, filename);
        const file = fs.createWriteStream(file_path);
        https.get(url, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve(true));
            });
        }).on('error', error => {
            fs.unlink(file_dir);
            reject(error.message);
        });
    }),
    async saveToCSV(json, fileName) {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(json);
        fs.writeFileSync(`${fileName}.csv`, csv);
    },
    async autoScroll(page) {
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                var totalHeight = 0;
                var distance = 100;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight - window.innerHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    },
    async sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
    },
    async scraper(browser, keyword) {
        const page = await browser.newPage();
        await page.goto(this.url);
        // const keyword = '대유 마이킹 250mL';
        console.log(`Navigating to ${this.url}...`);
        await page.$eval('[title="검색어 입력"]', (node, keyword) => node.value = keyword, keyword);
        const buttonNode = await page.$('._searchInput_button_search_1n1aw');
        await buttonNode.click();

        const subFilterNode = await page.waitForSelector('.subFilter_seller_filter__snFam');
        const subTabNodeList = await subFilterNode.$$('[data-testid=SEARCH_TAB_FILTER]');
        // 탭 가격비교로 변경
        await subTabNodeList[1].click();
        const itemListNode = await page.waitForSelector('.list_basis');
        const firstItemNode = await itemListNode.$('.list_basis > div > div > li');
        const firstItemPrice = await firstItemNode.$eval('[data-testid=SEARCH_PRODUCT_PRICE]', node => node.textContent);
        const firstItemURL = await firstItemNode.$eval('[data-testid=SEARCH_PRODUCT]', node => node.href);
        return {
            price: firstItemPrice,
            url: firstItemURL,
        }
    }
}

module.exports = scraperObject;