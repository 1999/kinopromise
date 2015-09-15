'use strict';

var util = require('util');
var Promise = require('native-promise-only');

function KinoPromise() {
    Promise.apply(this, arguments);
}

// inherit prototype methods
util.inherits(KinoPromise, Promise);

// also inherit static promise methods
KinoPromise.__proto__ = Promise;

KinoPromise.prototype.spread = function KinoPromise_spread(onFulfilled, onRejected) {
    var onFulfilledInternal = function (res) {
        if (Array.isArray(res)) {
            onFulfilled.apply(null, res);
        }
    };

    return this.then(onFulfilledInternal, onRejected);
};

KinoPromise.all = function KinoPromise_static_all(promises) {
    if (arguments.length > 1 || typeof promises !== 'object' || Array.isArray(promises)) {
        return Promise.all.apply(this, arguments);
    }

    return new KinoPromise(function (resolve, reject) {
        var promisesKeys = Object.keys(promises);
        var promisesArray = promisesKeys.map(function (key) {
            return promises[key];
        });

        Promise.all(promisesArray).then(function (res) {
            // transform output into an object
            var output = res.reduce(function (output, chunk, index) {
                output[promisesKeys[index]] = chunk;
                return output;
            }, {});

            resolve(output);
        }).catch(reject);
    });
};

module.exports = KinoPromise;
