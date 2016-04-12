var express = require('express');
var db = require('../db/data');
var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('user', { title: 'Express' });
});
router.post('/info',function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var query = req.body;
    db.regUser(query,function(data){
        var result = JSON.parse(data);
        console.log(result);
        res.end('123');
    });
});
module.exports = router;
