
var assert = require('assert');
var cowboyCli = require('cowboy-cli-api');
var testUtil = require('./util');
var util = require('util');

var _kill = null;

before(function(callback) {
    // Set up the cattle node we'll use for the tests
    cowboyCli.cattle(testUtil.defaultCattleConfig(), function(err, kill) {
        assert.ok(!err);
        _kill = kill;

        // Install the module we're testing for the running cattle node
        cowboyCli.cowboy(testUtil.defaultCowboyConfig(), 'install', [util.format('%s/..', __dirname)], function(code, output) {
            assert.strictEqual(code, 0);
            return callback();
        });
    });
});

after(function(callback) {
    _kill(false, function(code, signal) {
        return callback();
    });
});