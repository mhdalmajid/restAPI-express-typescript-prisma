/* eslint-disable import/no-extraneous-dependencies */
import winston from 'winston'
import chalk from 'chalk'
import morgan, { StreamOptions } from 'morgan'

// Define your severity levels.
// With them, You can create log files,
// see or hide levels based on the running ENV.
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

// This method set the current severity based on
// the current NODE_ENV: show all the log levels
// if the server was run in development mode; otherwise,
// if it was run in production, show only warn and error messages.
const level = () => {
  const env = process.env.NODE_ENV || 'development'
  const isDevelopment = env === 'development'
  return isDevelopment ? 'debug' : 'warn'
}

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  http: 'green',
  debug: 'white',
}
const CATEGORY = ''

// Tell winston that you want to link the colors
// defined above to the severity levels.
winston.addColors(colors)

// Chose the aspect of your log customizing the log format.
const format = winston.format.combine(
  // winston.format.colorize({ all: true }),
  winston.format.label({ label: CATEGORY }),
  winston.format.splat(),
  winston.format.printf((info) => {
    const { timestamp, message, label, ...args } = info
    let { level } = info

    switch (level.toUpperCase()) {
      case 'INFO':
        level = chalk.hex('#34ace0').bold(level)
        break

      case 'WARN':
        level = chalk.hex('#ffb142').bold(level)
        break

      case 'ERROR':
        level = chalk.hex('#ff4757').bold(level)
        break

      default:
        break
    }
    return ` ${label}${level} 🍄: ${message}`
  })
)

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    maxsize: 500,
  }),

  new winston.transports.File({ filename: 'logs/all.log', maxsize: 1024 * 10 }),
]

const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
})

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream: StreamOptions = {
  // Use the http severity
  write: (message) => Logger.http(message),
}
// Skip all the Morgan http log if the
// application is not running in development mode.
// This method is not really needed here since
// we already told to the logger that it should print
// only warning and error messages in production.
const skip = () => {
  const env = process.env.NODE_ENV
  return env !== 'development'
}

const morgFormat: morgan.FormatFn = (tokens, req, res) =>
  [
    // '\n\n',
    // chalk.hex('#ff4757').bold('🍄Morgan --> '),
    chalk.hex('#34ace0').bold(tokens.method(req, res)),
    chalk.hex('#ffb142').bold(tokens.status(req, res)),
    chalk.hex('#ff5252').bold(tokens.url(req, res)),
    chalk.hex('#2ed573').bold(`${tokens['response-time'](req, res)} ms`),
    // chalk.hex('#f78fb3').bold(`@ ${tokens.date(req, res)}`),
    // chalk.yellow(tokens['remote-addr'](req, res)),
    // chalk.hex('#fffa65').bold(`from ${tokens.referrer(req, res)}`),
    // chalk.hex('#1e90ff')(tokens['user-agent'](req, res)),
    '\n\n',
    chalk.hex('#f78fb3').bold(`---------------------------------  📦👌🐛New Log📖🚀🤖  ------------------------------`),
  ].join(' ')

const appListeningLogger = () => {
  Logger.info(chalk.hex('#f78fb3').bold(`------------------------------------------------------------------------`))
  Logger.info(chalk.hex('#f78fb3').bold(`server restarted 🔄----------------------------------------------------`))
  Logger.info(chalk.hex('#f78fb3').bold(`------------------------------------------------------------------------`))
  Logger.info(`Server 🚀🚀 and running on 👉 http://localhost:${process.env.APP_PORT} in ${process.env.NODE_ENV} Mode`)
}

const morganMiddleware = morgan(morgFormat, { stream, skip })

export { Logger as logger, morganMiddleware, appListeningLogger }
