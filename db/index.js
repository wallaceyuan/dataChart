var mysql = require('mysql');
var Memcached = require('memcached');
var pool = mysql.createPool({
    host:'120.27.5.9',
    user:'root',
    password:'admin',
    database:'dataChart'
});

var memcached = new Memcached('localhost:11111', {retries:10,retry:10000,remove:true,failOverServers:['192.168.159.1:11211']});

memcached.connect( 'localhost:11211', function( err, conn ){
    if( err ) throw new Error( err );
    console.log(1, conn.server );
});

memcached.set('key', 10, function (err) { /* stuff */ });
memcached.get('key', function (err, data) {
    console.log(data);
});
/*memcached.set( "hello_world", "greetings from planet node", 1000, function( err, success ){
    // check if the data was stored
    if(err){
        console.log(err);
    }
    console.log(success);
*//*    assert.equal( success, true, "Successfully stored data" )

    memcached.get( "hello_world", function( err, success ){
        assert.equal( success, "greetings from planet node", "Failed to fetched data" )
        process.stdout.write( success );
        memcached.end()
    });*//*
});*/


/*
pool.query('select * from category',function(err,rows){
     console.log(rows);
    //callback(err,rows);
});*/
