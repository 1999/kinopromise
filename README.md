## KinoPromise

[![Build Status](https://img.shields.io/travis/1999/kinopromise.svg?style=flat)](https://travis-ci.org/1999/kinopromise)

A bit of sugar on top of native ES2015 Promises.

## API
### KinoPromise.prototype.spread
```javascript
KinoPromise.all([
    new KinoPromise(function (resolve) { resolve(1) }),
    new KinoPromise(function (resolve) { resolve(2) })
]).spread(function (one, two) {
    assert.equal(one, 1); // true
    assert.equal(two, 2); // true
});
```

### KinoPromise.all with an object passing
```javascript
KinoPromise.all({
    foo: new KinoPromise(function (resolve) { resolve(1) }),
    bar: new KinoPromise(function (resolve) { resolve(2) })
}).then(function (res) {
    assert(res.foo, 1) // true
    assert(res.bar, 2) // true
});
```

### Prototype inheritance
```javascript
var promise = new KinoPromise(function () {});
promise instanceof Promise // true
```
