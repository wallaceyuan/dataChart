var request = require('request');
var Memcached = require('memcached');
Memcached.config.poolSize = 25;
var memcached = new Memcached( "120.27.5.9:11111" );
var mysql = require('mysql');
var pool = mysql.createPool({
    host:'120.27.5.9',
    user:'root',
    password:'admin',
    database:'dataChart'
});

exports.list = function(url,callback){
    memcached.get('chartList',function(err,rows){
        if(err) console.log(err);
        if (rows) {			//如果mmecache查到了
            memcached.end();
            callback(error,rows);
            console.log("find in cache");	//显示查询结果
        }else{
            console.log("notfind");	//显示查询结果
            request(url, function (error, response, body) {
                var data = JSON.parse(body);
                var source_pv = data['pv'].source_pv;
                var nameBox = [];var dataBox = [];var count = 0;
                var nameAll = [];var dataAll = [];
                for(var key in source_pv){
                    if(count<6){
                        nameBox.push(key);
                        dataBox.push({value:source_pv[key], name:key});
                    }
                    if(count<50){
                        nameAll.push(key);
                        dataAll.push({value:source_pv[key], name:key});
                    }
                    count++;
                }
                var rows = Array();
                var pageurl = data['pageurl'];
                rows.nameBox = nameBox;rows.dataBox = dataBox;rows.nameAll = nameAll;rows.dataAll = dataAll;
                rows.total_amount = pageurl['total_amount'];
                rows.total_delta = pageurl['total_delta'];
                rows.timestamp= data.timestamp;
                rows.delta_pv = data['pv'].delta_pv;
                rows.today_pv =  data['pv'].today_pv;
                rows.yesterday_pv = data['pv'].yesterday_pv;
                callback(error,rows);
            });
        }
    });
}

exports.pre = function(name,callback){
    var d = new Date();
    var etime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 0).getTime()/1000;
    var stime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime()/1000;
    var date = {stime:stime, etime:etime}
    var kkapi = 'http://api.kankanews.com/wechat/wxmp/kkpsc/'+name+'.json?openid=o81pDuLcFI2sNfOuLFYk9RlfSLWc&stime='+date.stime+'&etime='+date.etime+'&cmd=getPastData';
    request(kkapi, function (error, response, body) {
        var prevData = JSON.parse(body);
        var timeBox = [];var clickBox = [];var dtBox = [];var dclickBox = [];
        for(var key in prevData.clicknum){
            timeBox.push(key);
            clickBox.push(prevData.clicknum[key]);
        }
        for(var key in prevData.delta){
            dtBox.push(key);
            dclickBox.push(prevData.delta[key]);
        }
        var rows = Array();var res = Array();
        rows.timeBox = timeBox;rows.clickBox = clickBox;rows.dtBox = dtBox;rows.dclickBox = dclickBox;
        res['pre'] = rows;
        callback(error,res);
    });
}

exports.source = function(name,res){
    var name  = name;
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
}

exports.findUser = function (code,callback) {
    var sql = 'select * from userId where code ="'+code+'"';
    pool.query(sql,function(err,result){
        if(err){
            console.log(err);
        }else{
            callback(JSON.stringify(result));
        }
    });
}

exports.regUser = function(item,callback){
    pool.query('replace into reg_info(openId,city,figureurl,figureurl_1,figureurl_2,figureurl_qq_1,figureurl_qq_2,gender,is_lost,is_yellow_vip,level,msg,nickname,province,ret,vip,year,yellow_vip_level) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[item.openId,item.city,item.figureurl,item.figureurl_1,item.figureurl_2,item.figureurl_qq_1,item.figureurl_qq_2,item.gender,item.is_lost,item.is_yellow_vip,item.level,item.msg,item.nickname,item.province,item.ret,item.vip,item.year,item.yellow_vip_level],function(err,result){
        if(err){
            console.log(err);
        }else{
            callback(JSON.stringify(result));
        }
    });
}