var url = require('url');
var db = require('../db/data');

exports.checkLogin = function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query.id;
    if (req.session.user) {
        console.log('已登');
        next();
    }else{
        if(query!=undefined){
            db.findUser(query,function(data){
                var result = JSON.parse(data);
                if(result.length>0){
                    var user = result[0].code;
                    console.log('登录成功',user);
                    req.session.user = user;
                }else{
                    console.log('登录失败');
                }
                next();
            });
        }else{
            console.log('快去登录');
            next();
        }
    }
}

exports.checkNotLogin = function(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登录!');
        return res.redirect('back');//返回之前的页面
    }
    next();
}