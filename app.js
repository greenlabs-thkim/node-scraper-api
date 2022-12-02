var express = require('express');
var app = express();
var fs = require("fs");

app.get('/', function (req, res) {
   return res.send('welcome');
})

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("hello world !", host, port)
})