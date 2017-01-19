/**
 * Created by andre (http://korve.github.io/) on 07.06.2014
 *
 * Handles incoming http requests and serves the peertome.net frontend
 */
var peer = require( 'peer' ),
    logger = require( './logger' ),
    fs = require( 'fs' );

var numConnections = 0;
var port = process.env.APP_PORT || 9000;
var path = process.env.APP_PATH || '/';
var sslKey = process.env.APP_SSL_KEY;
var ipLimit = process.env.APP_IP_LIMIT || 10;
var concurrentLimit = process.env.APP_CONCURRENT_LIMIT || Number.MAX_VALUE;
var statsInterval = process.env.APP_STATS_INTERVAL || 10000;

var opts = {
    port: port,
    path: path,
    key: sslKey,
    ip_limit: ipLimit,
    concurrent_limit: concurrentLimit
};

if ( process.env.APP_SSL_ENABLED ) {
    var sslCert = process.env.APP_SSL_CERT;
    opts[ 'ssl' ] = {
        key: fs.readFileSync( sslKey ),
        certificate: fs.readFileSync( sslCert )
    }
}

var server = new peer.PeerServer( opts );

server.on( 'connection', function( id ) {
    numConnections++;
    logger.info( '[%s] connected', id );
} );

server.on( 'disconnect', function( id ) {
    numConnections--;
    logger.info( '[%s] disconnected', id );
} );

logger.info( 'Listening on ws://localhost:%d\t[ipLimit: %d]\t[concurrentLimit: %d]',
    port, ipLimit, concurrentLimit );

setInterval( printStats, statsInterval );

function printStats() {
    var memUsage = (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed( 2 ) + 'MB';

    logger.info( 'stats:\t[mem: %s]\t[conns: %d]', memUsage, numConnections );
    return printStats;
}

