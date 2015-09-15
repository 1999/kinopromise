'use strict';

var util = require('util');
var Promise = require('pinkie');

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
            return onFulfilled.apply(null, res);
        }
    };

    return this.then(onFulfilledInternal, onRejected);
};

KinoPromise.all = function KinoPromise_static_all(promises) {
    if (arguments.length > 1 || typeof promises !== 'object') {
        return Promise.all.apply(this, arguments);
    }

    return new KinoPromise(function (resolve, reject) {
        var isPromisesList = Array.isArray(promises);
        var promisesArray;
        var promisesKeys;

        if (isPromisesList) {
            promisesArray = promises;
        } else {
            promisesKeys = Object.keys(promises);
            promisesArray = promisesKeys.map(function (key) {
                return promises[key];
            });
        }

        Promise.all(promisesArray).then(function (res) {
            // transform output into an object
            var output;

            if (isPromisesList) {
                output = res;
            } else {
                output = res.reduce(function (output, chunk, index) {
                    output[promisesKeys[index]] = chunk;
                    return output;
                }, {});
            }

            resolve(output);
        }).catch(reject);
    });
};

module.exports = KinoPromise;
