'use strict';

const chai = require('chai');
const expect = chai.expect;
const KinoPromise = require('../');

describe('API interface tests', () => {
    it('global variables should exist', () => {
        expect(KinoPromise).to.exist;
        expect(KinoPromise).to.be.a('function');
    });

    it('should inherit from Promise', () => {
        const obj = new KinoPromise(() => undefined);

        expect(obj).to.be.instanceof(KinoPromise);
        expect(obj).to.be.instanceof(Promise);
    });

    it('should take strict number of arguments', () => {
        const obj = new KinoPromise(() => undefined);

        expect(obj.spread).to.have.length.within(1, 2);
        expect(KinoPromise.all).to.have.length(1);
    });

    it('KinoPromise.prototype.spread should invoke callback with resolved array like Function.prototype.apply does', () => {
        const promise = KinoPromise.all([
            new KinoPromise(resolve => resolve(1)),
            new KinoPromise(resolve => resolve(2))
        ]);

        expect(promise).to.be.instanceof(KinoPromise);

        return promise.spread(function () {
            expect(arguments).to.have.length(2);
            expect(arguments[0]).to.equal(1);
            expect(arguments[1]).to.equal(2);
        });
    });

    it('should allow object passing inside KinoPromise.all', () => {
        const promise = KinoPromise.all({
            foo: new KinoPromise(resolve => resolve(1)),
            bar: new KinoPromise(resolve => resolve(2))
        });

        expect(promise).to.be.instanceof(KinoPromise);

        return promise.then(function () {
            expect(arguments).to.have.length(1);
            expect(arguments[0].foo).to.equal(1);
            expect(arguments[0].bar).to.equal(2);
        });
    });

    it('KinoPromise.prototype.spread should invoke onRejected callback if smth goes wrong', () => {
        const promise = KinoPromise.all([
            new KinoPromise((resolve, reject) => reject(new Error('error'))),
            new KinoPromise(resolve => resolve(2))
        ]);

        return promise.spread(() => undefined, function () {
            expect(arguments).to.have.length(1);
            expect(arguments[0]).to.be.instanceof(Error);
        });
    });

    it('KinoPromise.prototype.spread should provide chainable data', () => {
        const promise = KinoPromise.all([
            new KinoPromise(resolve => resolve(1)),
            new KinoPromise(resolve => resolve(2))
        ]);

        return promise.spread((one, two) => {
            return {one, two};
        }).then(function () {
            expect(arguments).to.have.length(1);
            expect(arguments[0].one).to.equal(1);
            expect(arguments[0].two).to.equal(2);
        });
    });
});
