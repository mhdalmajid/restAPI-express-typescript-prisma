import chalk from 'chalk'
import * as expressWinston from 'express-winston'
import * as winston from 'winston'

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.label({ label: '' }),
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.printf((info) => {
      const { message, label } = info
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
    }),
    winston.format.colorize({ all: true })
  ),
  colorize: true,
}
export { loggerOptions }
