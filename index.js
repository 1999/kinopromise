'use strict';

function *objectIterator() {
    for (let key in this) {
        if (typeof this[key] === 'object' && this[key].then) {
            yield this[key].then(res => [key, res]);
        } else {
            yield [key, res];
        }
    }
}

function convertToObject(data) {
    let output = {};

    for (let [key, value] of data) {
        output[key] = value;
    }

    return output;
}

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
    if (arguments.length > 1 || typeof promises !== 'object') {
        return Promise.all.apply(Promise, arguments);
    }

    return new KinoPromise((resolve, reject) => {
        const isIterable = (promises[Symbol.iterator] !== undefined);

        if (!isIterable) {
            promises[Symbol.iterator] = objectIterator;
        }

        Promise.all(promises).then(output => {
            if (!isIterable) {
                output = convertToObject(output);
                delete promises[Symbol.iterator];
            }

            resolve(output);
        }).catch(reject);
    });
};

export default KinoPromise;
