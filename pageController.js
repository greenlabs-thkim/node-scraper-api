const naverStorePageScraper = require('./naverStorePageScraper');

async function scrapeAll(browserInstance, keyword) {
	let browser;
	try {
		browser = await browserInstance;
		return await naverStorePageScraper.scraper(browser, keyword);
	}
	catch (err) {
		console.log("Could not resolve the browser instance => ", err);
	}
}

module.exports = (browserInstance, keyword) => scrapeAll(browserInstance, keyword)