'use strict';

var shimmer = require('shimmer'),
    isBluebird = require('is-bluebird');

var Bluebird;
try {
    Bluebird = require('bluebird');
} catch (err) {}

module.exports = function patchBluebird(ns, Promise) {
    if (!ns || typeof ns.bind !== 'function' || typeof ns.run !== 'function') throw new TypeError('must include namespace to patch bluebird against');

    if (!Promise) {
        Promise = Bluebird;
        if (!Promise) throw new Error('could not require bluebird');
    } else if (!isBluebird.ctor(Promise)) {
        throw new TypeError('promise implementation provided must be bluebird');
    }

    var proto = Promise.prototype;
    shimmer.wrap(proto, '_addCallbacks', function(_addCallbacks) {
        return function ns_addCallbacks(fulfill, reject, progress, promise, receiver, domain) {
            if (typeof fulfill === 'function') fulfill = ns.bind(fulfill);
            if (typeof reject === 'function') reject = ns.bind(reject);
            if (typeof progress === 'function') progress = ns.bind(progress);

            return _addCallbacks.call(this, fulfill, reject, progress, promise, receiver, domain);
        };
    });
};
