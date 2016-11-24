var express = require('express');
var app = express();

var http = require('http').Server(app);
var path = require("path");

var port = process.env.port || 8000;

app.get('/', function (req, res) {
    res.sendFile(path.normalize(__dirname + "/src/index.html"));
});

app.use(express.static('app'));

http.listen(port, function () {
    console.log('listening on *:' + port);
});