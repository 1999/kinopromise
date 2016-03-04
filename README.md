## KinoPromise

[![Build Status](https://img.shields.io/travis/1999/kinopromise.svg?style=flat)](https://travis-ci.org/1999/kinopromise)
[![Dependency Status](http://img.shields.io/david/1999/kinopromise.svg?style=flat)](https://david-dm.org/1999/kinopromise#info=dependencies)
[![DevDependency Status](http://img.shields.io/david/dev/1999/kinopromise.svg?style=flat)](https://david-dm.org/1999/kinopromise#info=devDependencies)

A bit of sugar on top of native ES2015 Promises. KinoPromise inherits directly from native Promise object.

## API
### KinoPromise.prototype.spread
```javascript
KinoPromise.all([
    new KinoPromise(resolve => resolve(1)),
    new KinoPromise(resolve => resolve(2))
]).spread((one, two) => {
    assert.equal(one, 1); // true
    assert.equal(two, 2); // true
});
```

### KinoPromise.all with an object passing
```javascript
KinoPromise.all({
    foo: new KinoPromise(resolve => resolve(1)),
    bar: new KinoPromise(resolve => resolve(2))
}).then(({foo, bar}) {
    assert(foo, 1) // true
    assert(bar, 2) // true
});
```

### Prototype inheritance
```javascript
var promise = new KinoPromise(function () {});
promise instanceof Promise // true
```
