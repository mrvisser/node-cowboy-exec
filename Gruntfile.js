module.exports = function(grunt) {
    var mocha_grep = process.env['MOCHA_GREP'] || undefined;

    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        'mochaTest': {
            'test': {
                'src': ['tests/setup.js', 'tests/*/**/*.js', '!tests/node_modules/**/*.js'],
                'options': {
                    'grep': mocha_grep,
                    'ignoreLeaks': true,
                    'reporter': 'spec',
                    'timeout': 30000
                }
            }
        }
    });

    grunt.registerTask('default', 'mochaTest');

};
