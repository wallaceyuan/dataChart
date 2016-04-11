var express = require('express');
var middleware = require('../middleware/index');
var url = require('url');
var db = require('../db/data');
var router = express.Router();

/* GET home page. */
router.get('/',function(req, res, next) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query.id;
  if (!req.session.user) {
    if(query!=undefined){
      db.findUser(query,function(data){
        console.log('data',data);
      });
    }else{
      console.log('未登录');
    }
  }
  res.render('index', { title: 'Express' });
});


module.exports = router;
