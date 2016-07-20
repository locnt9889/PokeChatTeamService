/**
 * Created by LocNT on 7/29/15.
 */
var tracer = require('tracer');
var logger = tracer.console({
    format : "{{timestamp}} <{{title}}> in {{file}}:{{line}}: {{message}}",
    dateformat : "HH:MM:ss.L"
});

/*Exports*/
module.exports = {
    log : logger.log,
    trace : logger.trace,
    debug : logger.debug,
    info : logger.info,
    warn : logger.warn,
    error : logger.error
};