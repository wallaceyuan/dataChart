var url = require('url');
var db = require('../db/data');

exports.checkLogin = function(req, res, next) {
    console.log('checkLogin',req.session.openId);
    var url_parts = url.parse(req.url, true);
    if(req.session.openId != null){
        console.log('已登');
        next();
    }else{
        req.flash('error', '未登录!');
        return res.redirect('/users/login');
    }
}

exports.checkNotLogin = function(req, res, next) {
    if (req.session.openId) {
        req.flash('error', '已登录!');
        return res.redirect('back');//返回之前的页面
    }
    next();
}