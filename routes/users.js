var express = require('express');
var db = require('../db/data');
var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res) {
    res.render('user', { title: 'Express' });
});


router.get('/login', function(req, res) {
    res.render('user/login', { title: 'Express' });
});


router.post('/login',function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var query = req.body.openId;
    db.findUser(query,function(data){
        var result = JSON.parse(data);
        if(result.length>0){
            var user = result[0].code;
            req.session.openId = user;
            console.log('登录成功','session',req.session.openId);
            res.send({code:200});
            //return res.redirect('/:3000');
        }else{
            console.log('登录失败');
            res.send({code:302});
        }
    });
});


router.get('/reg', function(req, res) {
    res.render('user/reg', { title: 'Express' });
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
