var express = require('express');
var db = require('../db/data');
var middleware = require('../middleware/index');
var router = express.Router();
/* GET users listing. */
router.get('/',middleware.checkLogin, function(req, res) {
    res.render('user/user', { title: 'Express' });
});


router.get('/login',middleware.checkNotLogin, function(req, res) {
    res.render('user/login', { title: 'Express' });
});

router.post('/login',function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var query = req.body.openId;
    db.findUser(query,function(data){
        var result = JSON.parse(data);
        if(result.length>0){
            var user = result[0].code;
            req.flash('success', '登录成功!');
            req.session.openId = user;
            console.log(req.session.openId);
            //res.redirect('/');
            res.send({code:200});
            //res.redirect('/');//注册成功后返回主页
        }else{
            console.log('登录失败');
            res.send({code:302});
        }
    });
});


router.get('/reg',middleware.checkNotLogin, function(req, res) {
    res.render('user/reg', { title: 'Express' });
});

router.post('/reg',function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var query = req.body;
    db.regUser(query,function(data){
        var result = JSON.parse(data);
        console.log(result);
        res.end('200');
    });
});

//退出登录
router.get('/logout',middleware.checkLogin,function(req,res){
    req.session.openId  = null;
    res.redirect('/');//注册成功后返回主页
});

module.exports = router;
