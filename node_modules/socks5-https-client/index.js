/**
 * @overview
 * @author Matthew Caruana Galizia <m@m.cg>
 * @license MIT
 * @copyright Copyright (c) 2013, Matthew Caruana Galizia
 */

'use strict';

/*jshint node:true*/

var https = require('https');
var url = require('url');

var Agent = require('./lib/Agent');

exports.request = function(options, cb) {
	var agent, version;

	if (typeof options === 'string') {
		options = url.parse(options);
	}

	options.protocol = 'https:';

	// Node v0.12.0 requires the port to be specified.
	if (!options.port && options.host) {
		options.port = options.host.split(':')[1];
	}

	if (!options.port) {
		options.port = 443;
	}

	agent = new Agent(options);
	options.agent = agent;

	return https.request(options, cb);
};

exports.get = function(options, cb) {
	var req = exports.request(options, cb);

	req.end();

	return req;
};
