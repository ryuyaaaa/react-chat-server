var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

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
    var client = redis.createClient();
}

// redis server 接続(db:0 default)
client.on("error", function (err) {
    console.log("Error " + err);
});

io.on('connection', (socket) => {
    socket.on('message', (msg) => {
        console.log('message: ' + msg);

        // 全員に配信
        io.emit('message', msg);

        // 特定にIDに配信（ここでは送ってきたIDに返信）
        io.to(socket.io).emit('personal', 'PERSONAL');
        console.log('id: ' + socket.id)
    });
});

var router = require('./routes/index');
app.use('/api', router);

/*
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
*/

app.listen(PORT);
http.listen(PORT);
console.log('listen on port ' + PORT);

exports.client = client;
exports.io = io;