var express = require('express');
var db = require('../db/data');
var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res) {
    res.render('user', { title: 'Express' });
});


router.post('/login',function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var query = req.body.openId;
    db.findUser(query,function(data){
        var result = JSON.parse(data);
        if(result.length>0){
            var user = result[0].code;
            console.log('登录成功',user);
            req.session.user = user;
            console.log(req.session.user);
            res.send({code:200});
            //return res.redirect('/');
        }else{
            console.log('登录失败');
            res.send({code:302});
        }
    });
});


router.post('/reg',function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var query = req.body;
    db.regUser(query,function(data){
        var result = JSON.parse(data);
        console.log(result);
        res.end('123');
    });
});


module.exports = router;
