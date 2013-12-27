
var _ = require('underscore');
var child_process = require('child_process');
var colors = require('colors');
var optimist = require('optimist');
var util = require('util');

var Command = module.exports = function() {};

/**
 * Return an object that describes the help information for the plugin. The object has fields:
 *
 *  * description   : A String description of what the plugin does. Can be multiple lines.
 *  * args          : A single line of text showing the args.
 *                      E.g., "<required option> [<optional option>] [-v] [-d <directory>]"
 *  * examples      : A list of strings showing ways to use the module
 *
 *  {
 *      "description": "Uses npm -g to globally install a module on the cattle nodes.",
 *      "args": "<npm module>",
 *      "exampleArgs": ["express", "express@3.3.4", "git://github.com/visionmedia/express"]
 *  }
 *
 * @return  {Object}    An object describing the help information for the command
 * @runat   cowboy
 * @optional
 */
Command.prototype.help = function() {
    return {
        'description': 'Execute an arbitrary shell command on the cattle nodes',
        'args': '-c "command to execute"',
        'exampleArgs': [
            '-c "ls /etc/cowboy"',
            '-c "service redis-server restart"'
        ]
    };
};

/**
 * Validate the command context that was invoked by the user. This function must return a String as the first argument
 * in the `done` callback method in order to indicate a validation error message. If an error message is provided, the
 * command execution will not continue and the cattle nodes will not receive the command.
 *
 * @param   {CommandContext}    ctx             The context of the command
 * @param   {Function}          done            The function to invoke when validation is complete
 * @param   {String}            [done.message]  An error message to display for the user if the arguments are not
 *                                              correct
 * @runat   cowboy
 * @optional
 */
Command.prototype.validate = function(ctx, done) {
    var argv = _argv(ctx);

    if (!argv.c || !argv.c.trim()) {
        return done('You did not provide a shell command to execute using the "-c" argument');
    }

    return done();
};

/**
 * Provide a custom idle timeout for the command request. If your cattle command needs an unusually long (e.g., more
 * than 5 seconds) duration of time between reply frames being sent to the cowboy, it is important to set this to a
 * more appropriate idle timeout so that the cowboy does not timeout in its request.
 *
 * Note that there are some other ways to intervene idle timeout such as sending heartbeat frames to the cowboy during
 * command processing while operations are being performed.
 *
 * @return  {Number}    The timeout in milliseconds that the cowboy will wait between receiving reply frames from the
 *                      cattle nodes
 * @runat   cowboy
 * @optional
 */
Command.prototype.timeout = function() {
    return 5000;
};

/**
 * Perform any post-validation, pre-execution operations on the cowboy. This is useful for tasks such as setting
 * internal command state on the cowboy or outputting initial text for the user to indicate that the command will begin
 * executing.
 *
 * @param   {CommandContext}    ctx     The command context of the current command
 * @param   {Function}          done    The function to invoke when the command preparation is complete
 * @runat   cowboy
 * @optional
 */
Command.prototype.before = function(ctx, done) {
    var argv = _argv(ctx);

    console.log('Executing command: "%s"', argv.c);
    console.log(' ');

    return done();
};

/**
 * Perform the execution of the command on the cattle node.
 *
 * @param   {CommandContext}    ctx                     The command context of the current command
 * @param   {Function}          reply                   A function that can be used to send a frame of data to the
 *                                                      cowboy node. This can be invoked many times before the command
 *                                                      is complete
 * @param   {Object}            reply.data              The arbitrary reply data to send in this frame
 * @param   {Function}          [reply.callback]        Invoked when the reply has been sent to the cowboy
 * @param   {Error}             [reply.callback.err]    An error that occurred while sending the reply frame, if any
 * @param   {Function}          done                    A function that should be used to indicate that the command has
 *                                                      completed successfully. The cowboy node will hang until either
 *                                                      this method is invoked for all known cowboy nodes, or until it
 *                                                      times out
 * @param   {Function}          [done.callback]         Invoked when the end frame has been sent to the cowboy client
 * @param   {Error}             [done.callback.err]     An error that occured while sending the end frame, if any
 * @runat   cattle
 * @required
 */
Command.prototype.exec = function(ctx, reply, done) {
    var argv = _argv(ctx);

    var child = child_process.exec(argv.c, function(error, stdout, stderr) {
        reply({
            'type': 'complete',
            'data': {
                'error': error,
                'stdout': stdout,
                'stderr': stderr
            }
        });
        return done();
    });

    // Send data back to cowboy process as it comes to help prevent unwarranted timeouts
    child.stdout.on('data', function(data) {
        reply({
            'type': 'data',
            'stream': 'stdout',
            'data': data
        });
    });

    child.stderr.on('data', function(data) {
        reply({
            'type': 'data',
            'stream': 'stderr',
            'data': data
        });
    });
};

/**
 * Perform any operations necessary on the cowboy after an individual cattle node has finished executing (i.e., sent its
 * "end" frame). This is useful for operations such as setting internal command state or outputting feedback to the user
 * to indicate something has finished.
 *
 * @param   {CommandContext}    ctx         The context of the current command
 * @param   {String}            host        The host identifier of the cattle node who just finished processing
 * @param   {Object[]}          response    An array of response frames (mix-typed) that were sent by the cattle node
 *                                          while it was executing the command
 * @param   {Function}          done        The function to invoke when the hostEnd operations have been performed
 * @runat   cowboy
 * @optional
 */
Command.prototype.hostEnd = function(ctx, host, response, done) {

    // Get the execution complete frame
    response = _.findWhere(response, {'type': 'complete'});

    // Show the host with the error in the header if there is an error
    var header = util.format('Host: %s', host);
    var headerLength = 6 + host.length;

    if (!response || !response.data) {
        header += ' Invalid response!'.red;
        headerLength += 18;
    } else if (response.data.error) {
        header += util.format(' (Error: %s)'.red, response.data.error.code);
        headerLength += 10 + response.data.error.code.toString().length;
    } else {
        header += util.format(' (Success!)'.green);
        headerLength += 11;
    }

    console.log(header.bold);

    // Build a fancy underline that is appropriately long
    var line = '';
    for (var i = 0; i < headerLength + 1; i++) {
        line += '=';
    }

    console.log(line.bold);
    console.log(' ');

    response = response.data;

    if (response.stdout && response.stderr) {
        console.log('StdOut:'.bold.underline);
        console.log('');
        console.log(response.stdout);
        console.log('');
        console.log('StdErr:'.bold.underline);
        console.log('');
        console.log(response.stderr);
        console.log('');
    } else {
        console.log(response.stdout || response.stderr || '(No output)');
        console.log('');
    }

    return done();

};

/*!
 * Parse the command arguments using optimist
 */
var _argv = function(ctx) {
    return optimist.parse(ctx.args());
};
