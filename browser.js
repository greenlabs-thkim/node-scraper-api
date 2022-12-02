const puppeteer = require('puppeteer');

async function startBrowser(){
	let browser;
	try {
	    console.log("Opening the browser......");
	    browser = await puppeteer.launch({
	        headless: false,
	        args: ['--no-sandbox', '--disable-setuid-sandbox'],
	        'ignoreHTTPSErrors': true,
			env: {
				DISPLAY: ":10.0"
			}
	    });
	} catch (err) {
	    console.log("Could not create a browser instance => : ", err);
	}
	return browser;
}

module.exports = {
	startBrowser
};