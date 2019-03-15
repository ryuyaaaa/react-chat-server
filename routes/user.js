var express = require('express');
var router = express.Router();
var app = require('./../app');

/*--- /api/users/loginにPOSTアクションでアクセスしたときの処理 ---*/
router.post('/login', (req, res) => {
    app.client.hget(req.body.uid, 'email', (err, reply) => {
        console.log(reply);
        if (!reply) {
            console.log('存在しない');

            var param = {'message': 'POSTアクションのリクエストに失敗しました'};
            res.header('Content-Type', 'application/json; charset=utf-8')
                .status(401)
                .send(param);
            console.log(req.body);
        } else {
            console.log('該当あり');

            console.log(process.env.PORT);

            app.client.hget(req.body.uid, 'password', (err, reply) => {
                console.log(reply);
                if (reply === req.body.password) {
                    var param = {'uid': req.body.uid};
                    res.header('Content-Type', 'application/json; charset=utf-8')
                        .status(200)
                        .send(param);
                    console.log(req.body);       
                } else {
                    var param = {'message': 'POSTアクションのリクエストに失敗しました'};
                    res.header('Content-Type', 'application/json; charset=utf-8')
                        .status(401)
                        .send(param);
                    console.log(req.body);   
                }
            });
        }
    });
});

/*--- /api/users/signupにPOSTアクションでアクセスしたときの処理 ---*/
router.post('/signup', (req, res) => {
    app.client.hget(req.body.uid, 'email', (err, reply) => {
        console.log(reply);

        if (reply) {
            console.log('すでに存在');

            var param = {'message': 'POSTアクションのリクエストに失敗しました'};
            res.header('Content-Type', 'application/json; charset=utf-8')
                .status(422)
                .send(param);
            console.log(req.body);
        } else {
            console.log('新規登録可能');

            app.client.hset(req.body.uid, 'email', req.body.email, (err, reply) => {

                console.log(reply);
                app.client.hset(req.body.uid, 'password', req.body.password, (err, reply) => {

                    console.log(reply);
                    var param = {'uid': req.body.uid};
                    res.header('Content-Type', 'application/json; charset=utf-8')
                        .status(200)
                        .send(param);
                    
                    console.log('登録完了');
                });
            });
        }
    });
});

module.exports = router;