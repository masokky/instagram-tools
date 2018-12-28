# SOCKS5 HTTPS Client #

[![Build Status](https://travis-ci.org/mattcg/socks5-https-client.png?branch=master)](https://travis-ci.org/mattcg/socks5-https-client)

SOCKS v5 HTTPS client implementation in JavaScript for Node.js.

```js
var shttps = require('socks5-https-client');

shttps.get({
	hostname: 'encrypted.google.com',
	path: '/',
	rejectUnauthorized: true // This is the default.
}, function(res) {
	res.setEncoding('utf8');
	res.on('readable', function() {
		console.log(res.read()); // Log response to console.
	});
});
```

Specify the `socksHost` and `socksPort` options if your SOCKS server isn't running on `localhost:1080`. Tor runs its SOCKS server on port `9050` by default, for example.

Username and password authentication is supported with the `socksUsername` and `socksPassword` options.

You may also pass a URL as the first argument to `get` or `request`, which will be parsed using `url.parse`.

## Using with Tor ##

Works great for making HTTPS requests through [Tor](https://www.torproject.org/).

Make sure a Tor server is running locally and run `node example/tor https://check.torproject.org/` to test.

## Using with Request ##

To use with [Request](https://github.com/mikeal/request), just pass a reference to the `Agent` constructor..

```js
var Agent = require('socks5-https-client/lib/Agent');

request({
	url: 'https://encrypted.google.com/',
	strictSSL: true,
	agentClass: Agent,
	agentOptions: {
		socksHost: 'my-tor-proxy-host', // Defaults to 'localhost'.
		socksPort: 9050 // Defaults to 1080.
	}
}, function(err, res) {
	console.log(err || res.body);
});
```

## HTTP ##

This client only provides support for making HTTPS requests. See [socks5-http-client](https://github.com/mattcg/socks5-http-client) for an HTTP implementation.

## License ##

Copyright © 2013 [Matthew Caruana Galizia](http://twitter.com/mcaruanagalizia), licensed under an [MIT license](http://mattcg.mit-license.org/).
