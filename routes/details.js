var express = require('express');
var request = require('request');
var db = require('../db/data');
var async = require('async');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('detail', { title: 'Express' });
});

router.post('/now',function(req, res, next) {

});
//给路由先指定路径，再指定方法，还可以链式调用
router.route('/nav/:_id').get(function (req, res, next) {
    console.log(req.params._id);
    async.parallel([
        function (cb) {
            console.log(1);
            var url = 'http://api.kankanews.com/wechat/wxmp/kkpsc/kkpsc.json?openid=o81pDuLcFI2sNfOuLFYk9RlfSLWc&cmd=getIndex';
            db.list(url,cb);
        },
        function(cb){
            console.log(2,req.params._id);
            db.pre('all',cb);
        }
    ], function (err, result) {
        var r = result[0],pre = result['pre'];
        res.send({
            nameBox:r.nameBox, dataBox:r.dataBox, total_amount:r.total_amount,
            total_delta:r.total_delta, nameAll:r.nameAll,dataAll:r.dataAll,
            timestamp:r.timestamp,delta_pv:r.delta_pv,today_pv:r.today_pv,yesterday_pv:r.yesterday_pv,pre:pre
        });
    });
}).post(function (req, res) {
    console.log(req.params._id,3);
    var name  = req.body.name;
    db.source(name,res);
});



module.exports = router;
