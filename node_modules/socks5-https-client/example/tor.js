'use strict';

/*jshint node:true*/

var url = require('url');
var shttps = require('../');

var options = url.parse(process.argv[2]);

options.socksPort = 9050; // Tor default port.

var req = shttps.get(options, function(res) {
	res.setEncoding('utf8');

	res.on('readable', function() {
		var data = res.read();

		// Check for the end of stream signal.
		if (null === data) {
			process.stdout.write('\n');
			return;
		}

		process.stdout.write(data);
	});
});

req.on('error', function(e) {
	console.error('Problem with request: ' + e.message);
});

// GET request, so end without sending any data.
req.end();
