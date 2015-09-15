'use strict';

class KinoPromise extends Promise {
    spread(onFulfilled, onRejected) {
        let onFulfilledInternal = function (res) {
            if (Array.isArray(res)) {
                return onFulfilled(...res);
            }
        };

        return this.then(onFulfilledInternal, onRejected);
    }
}

KinoPromise.all = function KinoPromise_static_all(promises) {
    if (arguments.length > 1 || typeof promises !== 'object' || Array.isArray(promises)) {
        return Promise.all(...arguments);
    }

    return new KinoPromise(function (resolve, reject) {
        let promisesKeys = Object.keys(promises);
        let promisesArray = promisesKeys.map(key => promises[key]);

        Promise.all(promisesArray).then(function (res) {
            // transform output into an object
            let output = res.reduce((output, chunk, index) => {
                output[promisesKeys[index]] = chunk;
                return output;
            }, {});

            resolve(output);
        }).catch(reject);
    });
};

module.exports = KinoPromise;
