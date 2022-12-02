var express = require('express');
var app = express();
var fs = require("fs");
const browserObject = require('./browser');
const scraperController = require('./pageController');

app.get('/', async (req, res) => {
   try {
      const { keyword } = req.query;   
      //Start the browser and create a browser instance
      let browserInstance = browserObject.startBrowser();   
      // Pass the browser instance to the scraper controller
      const result = await scraperController(browserInstance, keyword);
      return res.json(result);      
   } catch (error) {
      return res.status(500).json(error);
   }
})

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("hello world !", host, port)
})