var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

var redis = require('redis');
var url = require('url');

const PORT = process.env.PORT || 8080;

// body-parserの設定
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

if (process.env.REDIS_URL) {
    var hr = url.parse(process.env.REDIS_URL);
    var client = redis.createClient(hr.port, hr.hostname);

    client.auth(hr.auth.split(":")[1]);
} else {
    var connection = redis.createClient();
}

// redis server 接続(db:0 default)
client.on("error", function (err) {
    console.log("Error " + err);
});

var router = require('./routes/index');
app.use('/api', router);

app.listen(PORT);
console.log('listen on port ' + PORT);

exports.client = client;