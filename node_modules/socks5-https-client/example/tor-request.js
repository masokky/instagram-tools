'use strict';

/*jshint node:true*/

var request = require('request');

var Agent = require('../lib/Agent');

request({
	url: process.argv[2],
	agentClass: Agent,
	agentOptions: {
		socksPort: 9050 // Defaults to 1080.
	}
}, function(err, res) {
	console.log(res.body);
});
