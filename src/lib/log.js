const colors = require('ansi-colors');

const logLevelConfig = {
    silly: {
        fn: colors.gray,
        prefix: 'SILLY'
    },
    info: {
        fn: colors.white,
        prefix: ' INF '
    },
    warning: {
        fn: colors.yellow,
        prefix: ' WRN '
    },
    error: {
        fn: colors.red,
        prefix: 'ERROR'
    },
    panic: {
        fn: colors.redBright,
        prefix: 'PANIC'
    },
};

const makeLogFunction = (config) => (msg) => {
    const dateTime = new Date().toISOString();
    console.log(config.fn(`[${config.prefix}][${dateTime}] ${msg}`));
}

class Logger {
    constructor() {
        this.silly = makeLogFunction(logLevelConfig.silly);
        this.info = makeLogFunction(logLevelConfig.info);
        this.warning = makeLogFunction(logLevelConfig.warning);
        this.error = makeLogFunction(logLevelConfig.error);
        this.panic = makeLogFunction(logLevelConfig.panic);
    }

    silly(msg) {
    }

    info(msg) {
    }

    warning(msg) {
    }

    error(msg) {
    }

    panic(msg) {
    }
}

module.exports = new Logger();