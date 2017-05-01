#!/usr/bin/env node
"use strict";

const fs = require( 'fs' );
const fork = require('child_process').fork;
const winston = require('winston');

function forkServer() {
	let childProcess = fork( 'src/server.js', process.argv.slice( 2 ) );

	childProcess.on('uncaughtException', () => {
		childProcess.kill();
		forkServer();
	});
	childProcess.on('exit', () => {
		forkServer();
	});

	console.info( `new process ${childProcess.pid}` );
	return childProcess;
}

forkServer();