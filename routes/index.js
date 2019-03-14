var express = require('express');
var router = express.Router();

router.use('/users', require('./user.js'));

module.exports = router;