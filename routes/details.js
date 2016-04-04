var express = require('express');
var request = require('request');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('detail', { title: 'Express' });
});

router.post('/now',function(req, res, next) {

});
//给路由先指定路径，再指定方法，还可以链式调用
router.route('/nav').get(function (req, res, next) {
    var url = 'http://api.kankanews.com/wechat/wxmp/kkpsc/kkpsc.json?openid=o81pDuLcFI2sNfOuLFYk9RlfSLWc&cmd=getIndex';
    request(url, function (error, response, body) {
        var data = JSON.parse(body);
        var source_pv = data['pv'].source_pv;
        var nameBox = [];var dataBox = [];var count = 0;
        for(var key in source_pv){
            if(count<6){
                count++;
                nameBox.push(key);
                dataBox.push({value:source_pv[key], name:key});
            }
        }
        var pageurl = data['pageurl'];
        var total_amount = pageurl['total_amount'];
        var total_delta = pageurl['total_delta'];
        var timestamp = data.timestamp;
        var delta_pv = data['pv'].delta_pv;
        var today_pv =  data['pv'].today_pv;
        var yesterday_pv = data['pv'].yesterday_pv;
        res.send({
            nameBox:nameBox,
            dataBox:dataBox,
            total_amount:total_amount,
            total_delta:total_delta,
            timestamp:timestamp,delta_pv:delta_pv,today_pv:today_pv,yesterday_pv:yesterday_pv
        });
    });
}).post(function (req, res) {
    console.log(req.body.name);
    var name  = req.body.name;
    var kkapi = "http://api.kankanews.com/wechat/wxmp/kkpsc/"+name+".json?openid=o81pDuLcFI2sNfOuLFYk9RlfSLWc&cmd=getSource&source="+name;
    request(kkapi, function (error, response, body) {
        var data = JSON.parse(body);
        var pageurl = data['pageurl'];
        var total_amount = pageurl['amount'];
        var total_delta = pageurl['delta'];
        var timestamp = data.timestamp;
        var delta_pv = data['pv'].delta_pv;
        var today_pv =  data['pv'].today_pv;
        var yesterday_pv = data['pv'].yesterday_pv;
        res.send({
            total_amount:total_amount,
            total_delta:total_delta,
            timestamp:timestamp,delta_pv:delta_pv,today_pv:today_pv,yesterday_pv:yesterday_pv
        });
    });
});




module.exports = router;
