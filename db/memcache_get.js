/**
 * Created by Yuan on 2016/4/9.
 */
var Memcached = require( 'memcached' );

var memcached = new Memcached("120.27.5.9:11111" );
memcached.get( "hello", function( err, result ){
    if( err ) console.error( err );
    console.dir( result );
    memcached.end();
});