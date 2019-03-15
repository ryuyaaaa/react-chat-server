var express = require('express');
var router = express.Router();
var app = require('./../app');

/*--- /api/usersにGETアクションでアクセスしたときの処理 ---*/

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

            app.client.hget(req.body.uid, 'password', (err, reply) => {
                if (reply == req.body.password) {
                    var param = {'message': 'POSTアクションのリクエストに失敗しました'};
                    res.header('Content-Type', 'application/json; charset=utf-8')
                        .status(200)
                        .send(param);
                    console.log(req.body);       
                } else {
                    var param = {'uid': req.body.uid};
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

/*
router.post('/login', (req, res) => {
    var sql = 'select * from users where email = ? and password = ?';
    app.connection.query(sql, [req.body.email, req.body.password], (error, results, fields) => {

        if (results == '') {
            console.log('データが存在しません');
            
            var param = {'message': 'POSTアクションのリクエストに失敗しました'};
            res.header('Content-Type', 'application/json; charset=utf-8')
                .status(401)
                .send(param);
            console.log(req.body);

        } else {
            console.log('ログイン可能');
            console.log(results);

            var param = {'uid': req.body.uid};
            res.header('Content-Type', 'application/json; charset=utf-8')
                .status(200)
                .send(param);
            console.log(req.body);
        }
    });
});

*/

/*--- /api/users/signupにPOSTアクションでアクセスしたときの処理 ---*/

/*
router.post('/signup', (req, res) => {
    var sql = 'select * from users where uid = ?';
    app.connection.query(sql, req.body.uid, (error, results, fields) => {

        if (results == '') {
            console.log('新規登録可能');

            // 新規登録可能であるとき
            sql = 'insert into users set ?';
            var data = {uid:req.body.uid, email:req.body.email, password: req.body.password};
            app.connection.query(sql, data, (error, results, fields) => {

                if (error) {
                    console.log('通信が失敗しました');
                    var param = {'message': 'POSTアクションのリクエストに失敗しました'};
                    res.header('Content-Type', 'application/json; charset=utf-8')
                        .status(422)
                        .send(param);
                    console.log(req.body);
                } else {
                    console.log('通信が成功しました');
                    var param = {'uid': req.body.uid};
                    res.header('Content-Type', 'application/json; charset=utf-8')
                        .status(200)
                        .send(param);
                    console.log(results);
                }
            });

        } else {
            console.log('uidが既に存在');
            console.log(results);

            var param = {'message': 'POSTアクションのリクエストに失敗しました'};
            res.header('Content-Type', 'application/json; charset=utf-8')
                .status(422)
                .send(param);
            console.log(req.body);
        }




    });
});

*/

module.exports = router;