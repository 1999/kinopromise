'use strict';

class KinoPromise extends Promise {
    spread(onFulfilled, onRejected) {
        function onFulfilledInternal(res) {
            if (Array.isArray(res)) {
                return onFulfilled(...res);
            }
        };

        return this.then(onFulfilledInternal, onRejected);
    }
}

KinoPromise.all = function KinoPromise_static_all(promises) {
    if (arguments.length > 1 || typeof promises !== 'object') {
        return Promise.all.apply(Promise, arguments);
    }

    return new KinoPromise((resolve, reject) => {
        const isPromisesList = Array.isArray(promises);
        let promisesArray;
        let promisesKeys;

        if (isPromisesList) {
            promisesArray = promises;
        } else {
            promisesKeys = Object.keys(promises);
            promisesArray = promisesKeys.map(key => promises[key]);
        }

        Promise.all(promisesArray).then(res => {
            // transform output into an object
            let output;

            if (isPromisesList) {
                output = res;
            } else {
                output = res.reduce((output, chunk, index) => {
                    output[promisesKeys[index]] = chunk;
                    return output;
                }, {});
            }

            resolve(output);
        }).catch(reject);
    });
};

export default KinoPromise;
