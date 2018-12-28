/**
 * @overview
 * @author Matthew Caruana Galizia <m@m.cg>
 * @copyright Copyright (c) 2013, Matthew Caruana Galizia
 * @license MIT
 * @preserve
 */

'use strict';

/*jshint node:true*/
/*global test, suite, setup*/

var assert = require('assert');
var net = require('net');
var request = require('request');
var socks = require('node-socks/socks.js');
var https = require('../');
var Agent = require('../lib/Agent');

suite('socks5-https-client tests', function() {
	var server;

	this.timeout(5000);

	suiteSetup(function(done) {
		server = socks.createServer(function(socket, port, address, proxyReady) {
			var proxy;

			proxy = net.createConnection(port, address, proxyReady);

			proxy.on('data', function(data) {
				socket.write(data);
			});

			socket.on('data', function(data) {
				proxy.write(data);
			});

			proxy.on('close', function() {
				socket.end();
			});

			socket.on('close', function() {
				proxy.removeAllListeners('data');
				proxy.end();
			});
		});

		server.listen(1080, 'localhost', 511, function() {
			done();
		});

		server.on('error', function(err) {
			throw err;
		});
	});

	test('simple request', function(done) {
		var req;

		req = https.request('https://en.wikipedia.org/wiki/Main_Page', function(res, err) {
			var data = '';

			assert.ifError(err);
			assert.equal(res.statusCode, 200);

			res.setEncoding('utf8');
			res.on('readable', function() {
				data += res.read();
			});

			res.on('end', function() {
				assert(-1 !== data.indexOf('<html'));
				assert(-1 !== data.indexOf('</html>'));

				done();
			});
		});

		req.on('error', function(err) {
			assert.fail(err);
		});

		// GET request, so end without sending any data.
		req.end();
	});

	test('using request', function(done) {
		var req;

		request({
			url: 'https://encrypted.google.com/',
			agentClass: Agent,
			strictSSL: true
		}, function(err, res, data) {
			assert.ifError(err);
			assert.equal(res.statusCode, 200);

			assert(-1 !== data.indexOf('<html'));
			assert(-1 !== data.indexOf('</html>'));

			done();
		});
	});
});
