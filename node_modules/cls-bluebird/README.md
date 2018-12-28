# continuation-local-storage support for bluebird promises

[![NPM version](https://img.shields.io/npm/v/cls-bluebird.svg)](https://www.npmjs.com/package/cls-bluebird)
[![Build Status](https://img.shields.io/travis/TimBeyer/cls-bluebird/master.svg)](http://travis-ci.org/TimBeyer/cls-bluebird)
[![Dependency Status](https://img.shields.io/david/TimBeyer/cls-bluebird.svg)](https://david-dm.org/TimBeyer/cls-bluebird)
[![Dev dependency Status](https://img.shields.io/david/dev/TimBeyer/cls-bluebird.svg)](https://david-dm.org/TimBeyer/cls-bluebird)
[![Coverage Status](https://img.shields.io/coveralls/TimBeyer/cls-bluebird/master.svg)](https://coveralls.io/r/TimBeyer/cls-bluebird)

Patch [bluebird](https://www.npmjs.com/package/bluebird) for [continuation-local-storage](https://www.npmjs.com/package/continuation-local-storage) support.

## Current Status

Currently works with bluebird v2.x only. But bluebird v3.x support coming soon!

## Usage

### `clsBluebird( ns [, Promise] )`

```js
var cls = require('continuation-local-storage');
var ns = cls.createNamespace('myNamespace');

var Promise = require('bluebird');
var clsBluebird = require('cls-bluebird');

clsBluebird( ns );
// Promise is now patched to maintain CLS context
```

The above patches the "global" instance of bluebird. So anywhere else in the same app that calls `require('bluebird')` will get the patched version (assuming npm resolves to the same file).

### Patching a particular instance of Bluebird

To patch a particular instance of bluebird:

```js
var Promise = require('bluebird');
var clsBluebird = require('cls-bluebird');

clsBluebird( ns, Promise );
```

This is a more robust approach.

### Nature of patching

Combining CLS and promises is a slightly tricky business. There are 3 different conventions one could use (see [this issue](https://github.com/TimBeyer/cls-bluebird/issues/6) for more detail).

`cls-bluebird` follows the convention of binding `.then()` callbacks **to the context in which `.then()` is called**.

```js
var promise;
ns.run(function() {
    ns.set('foo', 123);
    promise = Promise.resolve();
});

ns.run(function() {
    ns.set('foo', 456);
    promise.then(print);
});

function print() {
    console.log(ns.get('foo'));
}

// this outputs '456' (the value of `foo` at the time `.then()` was called)
```

## Tests

Use `npm test` to run the tests.

The tests require a Redis server to be up and running on localhost on the standard port.

Work is underway to expand the tests and remove the dependence on Redis.

## Changelog

See [changelog.md](https://github.com/TimBeyer/cls-bluebird/blob/master/changelog.md)

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/TimBeyer/cls-bluebird/issues

## Contribution

Pull requests are very welcome. Please:

* ensure all tests pass before submitting PR
* add an entry to changelog
* add tests for new features
* document new functionality/API additions in README
