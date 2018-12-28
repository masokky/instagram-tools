'use strict';

// jshint quotmark:false

var test = require('tap').test;

test("promises + CLS without shim = failure", function (t) {
  t.plan(4);

  var cls = require('continuation-local-storage');
  var ns = cls.createNamespace('test1');

  var Promise = require('bluebird');

  var redis = require('redis');
  var client = redis.createClient();

  function fetch(key) {
    t.equal(ns.get('id'), key, "cls ID matches what was passed");
    var get = Promise.promisify(client.get, client);
    return get(key).then(
      function (data) {
        var parsed = JSON.parse(data);
        t.equal(parsed.id, key, "retrieved correct value");
        t.notOk(ns.get('id'), "inner context value isn't available");

        if (parsed) {
          return parsed;
        } else {
          return Promise.reject();
        }
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }

  function test() {
    ns.run(function () {
      ns.set('id', 1);
      fetch(ns.get('id')).then(function () {
        t.notOk(ns.get('id'), "inner context value is lost in resolved");
        client.end();
      }).catch(function (error) {
        t.notOk(ns.get('id'), "inner context value is lost in failed");
        t.fail(error);
      });
    });
  }

  ns.run(function () {
    var saved = Promise.defer();
    var data = JSON.stringify({id : 1});
    client.set(1, data, saved.resolve.bind(saved));

    saved.promise.then(test);
  });
});

test("promises + CLS with shim = success", function (t) {
  t.plan(4);

  var cls = require('continuation-local-storage');
  var ns = cls.createNamespace('test2');

  var Promise = require('bluebird');

  // load shim
  var patchPromise = require('../shim.js');
  patchPromise(ns);

  var redis = require('redis');
  var client = redis.createClient();

  function fetch(key) {
    t.equal(ns.get('id'), key, "cls ID matches what was passed");

    var get = Promise.promisify(client.get, client);

    return get(key).then(function (data) {
      var parsed = JSON.parse(data);
      t.equal(parsed.id, key, "retrieved correct value");
      t.equal(ns.get('id'), parsed.id, "correct inner context value in ninvoke");

      if (parsed) {
        return parsed;
      } else {
        return Promise.reject();
      }
    },
    function (error) {
      t.ok(error, "fetch error");
      return Promise.reject(error);
    }
    );
  }

  function test() {
    ns.run(function () {
      ns.set('id', 1);
      fetch(ns.get('id')).then(function (data) {
        t.equal(ns.get('id'), data.id, "correct inner context value in resolved");
        client.end();
      }).catch(function (error) {
        t.equal(ns.get('id'), 1, "correct inner context value in failed");
        t.fail(error);
      });
    });
  }

  ns.run(function () {
    var saved = Promise.defer();
    var data = JSON.stringify({id : 1});
    client.set(1, data, saved.resolve.bind(saved));

    saved.promise.then(test);
  });
});
