export class Logger {
    constructor(ns, logLevel = 'debug') {
        this.ns = ns;
        this.logLevel = logLevel;
    }

    debug(message) {
        if (this.shouldLog('debug')) {
            this.log('[DBG] ' + message);
        }
    }

    warning(message) {
        if (this.shouldLog('warning')) {
            this.log('[WRN] ' + message);
        }
    }

    info(message) {
        if (this.shouldLog('info')) {
            this.log('[INF] ' + message);
        }
    }

    error(message) {
        if (this.shouldLog('error')) {
            this.log('[ERR] ' + message);
        }
    }

    panic(message) {
        this.log('[PNC] ' + message);
        this.ns.exit();
    }

    shouldLog(level) {
        const levels = ['debug', 'warning', 'info', 'error'];
        const currentLevelIndex = levels.indexOf(this.logLevel);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex >= currentLevelIndex;
    }

    log(message) {
        this.ns.tprintf(message);
    }

    test() {
        this.debug('This is a debug message'); // Will not log
        this.warning('This is a warning message'); // Will log
        this.info('This is an info message'); // Will log
        this.error('This is an error message'); // Will log
        this.panic('This is a panic message'); // Will log and exit the program
    }
}
