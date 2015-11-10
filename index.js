'use strict';

module.exports = (process.release && process.release.name === 'node')
    ? require('./lib/es2015-build')
    : require('./lib/es5');
