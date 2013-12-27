
var assert = require('assert');
var cowboyCli = require('cowboy-cli-api');
var testUtil = require('../util');
var util = require('util');

describe('Exec', function() {

    it('returns the stdout output from a command when there is only stdout', function(callback) {
        cowboyCli.cowboy(testUtil.defaultCowboyConfig(), 'exec', ['-c', 'echo "test echo"'], function(code, output) {
            assert.strictEqual(code, 0);

            var lines = output.split('\n');
            _assertHeader(lines, 'echo "test echo"');
            assert.strictEqual(lines[5], 'test echo');

            return callback();
        });
    });

    it('returns the stderr output from a command when there is only stderr', function(callback) {
        cowboyCli.cowboy(testUtil.defaultCowboyConfig(), 'exec', ['-c', 'echo "test echo" 1>&2'], function(code, output) {
            assert.strictEqual(code, 0);

            var lines = output.split('\n');
            _assertHeader(lines, 'echo "test echo" 1>&2');
            assert.strictEqual(lines[5], 'test echo');

            return callback();
        });
    });

    it('returns both the stdout and stderr output from a command when there is data on both streams', function(callback) {
        cowboyCli.cowboy(testUtil.defaultCowboyConfig(), 'exec', ['-c', 'echo "test echo"; echo "test echo" 1>&2'], function(code, output) {
            assert.strictEqual(code, 0);

            var lines = output.split('\n');
            _assertHeader(lines, 'echo "test echo"; echo "test echo" 1>&2');
            assert.ok(lines[5].indexOf('StdOut') > -1);
            assert.strictEqual(lines[7], 'test echo');
            assert.ok(lines[10].indexOf('StdErr') > -1);
            assert.strictEqual(lines[12], 'test echo');

            return callback();
        });
    });

    it ('reports a no output placeholder if there is no output from the command', function(callback) {
        cowboyCli.cowboy(testUtil.defaultCowboyConfig(), 'exec', ['-c', 'exit 0'], function(code, output) {
            assert.strictEqual(code, 0);

            var lines = output.split('\n');
            _assertHeader(lines, 'exit 0');
            assert.strictEqual(lines[5], '(No output)');

            return callback();
        });
    });

    it('returns an error code in the header when the command exits with an error code', function(callback) {
        cowboyCli.cowboy(testUtil.defaultCowboyConfig(), 'exec', ['-c', 'exit 12'], function(code, output) {
            assert.strictEqual(code, 0);

            var lines = output.split('\n');
            _assertHeader(lines, 'exit 12', 12);
            assert.strictEqual(lines[5], '(No output)');

            return callback();
        });
    });
});

/*!
 * Ensure the header output information meets the specified criteria
 */
var _assertHeader = function(lines, cmd, errCode) {
    assert.strictEqual(lines[0], util.format('Executing command: "%s"', cmd));
    assert.ok(lines[2].indexOf('test_host') > 0);

    if (!errCode) {
        assert.ok(lines[2].indexOf('Success!') > 0);
        assert.strictEqual(lines[2].indexOf('Error'), -1);
    } else {
        assert.strictEqual(lines[2].indexOf('Success'), -1);
        assert.ok(lines[2].indexOf(util.format('Error: %d', errCode)) > 0);
    }
};
