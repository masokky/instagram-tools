# tough-cookie-file-store

[![NPM](https://nodei.co/npm/tough-cookie-file-store.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/tough-cookie-file-store/)

Another file store for tough-cookie module.

The main purpose of this project is to have a published module with the original functionality of [tough-cookie-filestore][0] plus various fixes, improvements and features that I found useful.

## Installation
``` sh
$ npm install tough-cookie-file-store
```

## Usage
``` js
var cookieStore = require('tough-cookie-file-store');
var CookieJar = require('tough-cookie').CookieJar;
var jar = new CookieJar(new cookieStore('./cookie.json'));

/* check if cookie is empty or expired */
var cookieStore	= require('tough-cookie-file-store');
var cookieInstance = new cookieStore('./cookie.json');
cookieInstance.isExpired() // will return True if the cookie is expired
cookieInstance.isEmpty() // will return True if cookie is empty

/* request example */
var cookieStore = require('tough-cookie-file-store');
var j = request.jar(new cookieStore('./cookie.json'));
request = request.defaults({ jar : j })
request('http://www.google.com', function() {
  request('http://images.google.com')
})
```

## Credits
tough-cookie-filestore module: [@mitsuru][1]

fixes/improvements: [@sarkian][2] [@mudkipme][3] [@vladh][4]

expired feature: [@zhzehong][5]

## License
MIT

[0]: https://github.com/mitsuru/tough-cookie-filestore
[1]: https://github.com/mitsuru/
[2]: https://github.com/sarkian
[3]: https://github.com/mudkipme
[4]: https://github.com/vladh
[5]: https://github.com/zhzehong
