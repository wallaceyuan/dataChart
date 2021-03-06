var Memcached = require('memcached');
Memcached.config.poolSize = 25;

// connect to our memcached server on host 10.211.55.5, port 11211
var memcached = new Memcached( "120.27.5.9:11111" );
memcached.set( "hello", 1111, 3600, function( err, result ){
    if( err ) console.error( err );

    console.dir( result );
    memcached.end(); // as we are 100% certain we are not going to use the connection again, we are going to end it
});