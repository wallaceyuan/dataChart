var express = require('express');
var middleware = require('../middleware/index');
var db = require('../db/data');
var router = express.Router();

/* GET home page. */
router.get('/',function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
