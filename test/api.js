'use strict';

var chai = require('chai');

var expect = chai.expect;
var KinoPromise = require('../');

describe('API interface tests', function () {
    it('global variables should exist', function () {
        expect(KinoPromise).to.exist;
        expect(KinoPromise).to.be.a('function');
    });

    it('should inherit from Promise', function () {
        var obj = new KinoPromise(function () {});

        expect(obj).to.be.instanceof(KinoPromise);
        expect(obj).to.be.instanceof(Promise);
    });

    it('should take strict number of arguments', function () {
        var obj = new KinoPromise(function () {});

        expect(obj.spread).to.have.length.within(1, 2);
        expect(KinoPromise.all).to.have.length(1);
    });

    it('KinoPromise.prototype.spread should invoke callback with resolved array like Function.prototype.apply does', function () {
        var promise = KinoPromise.all([
            new KinoPromise(function (resolve) { resolve(1) }),
            new KinoPromise(function (resolve) { resolve(2) })
        ]);

        expect(promise).to.be.instanceof(KinoPromise);

        return promise.spread(function () {
            expect(arguments).to.have.length(2);
            expect(arguments[0]).to.equal(1);
            expect(arguments[1]).to.equal(2);
        });
    });

    it('should allow object passing inside KinoPromise.all', function () {
        var promise = KinoPromise.all({
            foo: new KinoPromise(function (resolve) { resolve(1) }),
            bar: new KinoPromise(function (resolve) { resolve(2) })
        });

        expect(promise).to.be.instanceof(KinoPromise);

        return promise.then(function () {
            expect(arguments).to.have.length(1);
            expect(arguments[0].foo).to.equal(1);
            expect(arguments[0].bar).to.equal(2);
        });
    });

    it('KinoPromise.prototype.spread should invoke onRejected callback if smth goes wrong', function () {
        var promise = KinoPromise.all([
            new KinoPromise(function (resolve, reject) { reject(new Error('error')) }),
            new KinoPromise(function (resolve) { resolve(2) })
        ]);

        return promise.spread(function () {}, function () {
            expect(arguments).to.have.length(1);
            expect(arguments[0]).to.be.instanceof(Error);
        });
    });

    it('KinoPromise.prototype.spread should provide chainable data', function () {
        var promise = KinoPromise.all([
            new KinoPromise(function (resolve, reject) { resolve(1) }),
            new KinoPromise(function (resolve) { resolve(2) })
        ]);

        return promise.spread(function (one, two) {
            return {
                foo: one,
                bar: two
            };
        }).then(function () {
            expect(arguments).to.have.length(1);
            expect(arguments[0].foo).to.equal(1);
            expect(arguments[0].bar).to.equal(2);
        });
    });
});
