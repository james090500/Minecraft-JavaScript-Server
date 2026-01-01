import winston from 'winston'

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'HH:mm:ss',
        }),
        winston.format.printf((info) => {
            return `[${info.timestamp} ${info.level.toLocaleUpperCase()}]: ${info.message}`
        }),
        winston.format.colorize({
            all: true,
        })
    ),
    transports: [new winston.transports.Console()],
})

if (process.env.APP_DEBUG === 'true') {
    logger.level = 'debug'
    logger.debug('MCServer is in Debug Mode')
}

logger.info('Winston Loaded')

export default logger
