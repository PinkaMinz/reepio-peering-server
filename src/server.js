"use strict";

const util = require('util');
const program = require('commander');
const packageJson = require("../package.json");
const peer = require( 'peer' );

let options;

program
	.version(packageJson.version)
	.option('--host <n>', 'Set host', '0.0.0.0')
	.option('--port <n>', 'Set ws port', 9001)
	.option('--path <path>', 'Set url path', '/')
	.option('--private-key', 'Set ssl private key', null, null)
	.option('--public-key', 'Set ssl public key', null, null)
	.option('--ip-limit <n>', 'Set max number of connections per ip address', null, 10)
	.parse(process.argv);

options = {
	host: program.host,
	port: program.port,
	path: program.path,
	concurrent_limit: program.ipLimit
};

if(program.privateKey && program.publicKey) {
	options.ssl = {
		key: fs.readFileSync( program.privateKey ),
		certificate: fs.readFileSync( program.publicKey )
	};
}

console.log( `peering server [${options.host}:${options.port}${options.path}] starting with options: ${util.inspect(options)}` );
try {
	new peer.PeerServer( options );
} catch(e) {
	console.error(e);
	process.exit(2);
}