
var util = require('util');

var defaultCowboyConfig = module.exports.defaultCowboyConfig = function() {
    return {
        'data': {
            'hostname': 'test_host'
        },
        'log': {
            'level': 'trace',
            'path': util.format('%s/cowboy.log', __dirname)
        },
        'modules': {
            'dir': __dirname
        }
    };
};

var defaultCattleConfig = module.exports.defaultCattleConfig = function() {
    return {
        'data': {
            'hostname': 'test_host'
        },
        'log': {
            'level': 'trace',
            'path': util.format('%s/cattle.log', __dirname)
        },
        'modules': {
            'dir': __dirname
        }
    };
};