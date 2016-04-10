var mysql = require('mysql');
var pool = mysql.createPool({
    host:'120.27.5.9',
    user:'root',
    password:'admin',
    database:'dataChart'
});

pool.query('select * from category',function(err,rows){
     console.log(rows);
    //callback(err,rows);
});
