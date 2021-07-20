import { createLogger, config, format, transports, addColors } from 'winston'
const { combine, colorize, splat, simple, timestamp, json, label, ms } = format

/*  Default log-levels as specified by RFC5424
const levels = {
  error: 0, // red
  warn: 1, // yellow
  info: 2, // green
  http: 3, // green
  verbose: 4, // cyan
  debug: 5, // blue
  silly: 6 // not shown
};
 */

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
const logger = createLogger({
  level: 'info', // process.env.NODE_ENV === "production" ? "info" : "debug"
  levels: config.npm.levels, // default (see above)
  format: combine(colorize(), splat(), simple(), timestamp(), ms()), // json()
  transports: [new transports.Console()],
  exitOnError: true, // default
  silent: false // default
})

export default logger
