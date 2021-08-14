import debug from 'debug'
import http from 'http'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import path from 'path'
import terminate from './core/config/Terminal'
import app from './core/config/app'

// todo: options for cors , sendgrid api ,express-rate-limit ,HPP,lusca,csurf
const server = http.createServer(app)
const debugLog: debug.IDebugger = debug('app')
const exitHandler = terminate(server, {
  coredump: false,
  timeout: 500,
})

const message = `Server 🚀🚀 and running on 👉 http://localhost:${process.env.APP_PORT} in ${process.env.NODE_ENV} Mode`

export default server.listen(process.env.APP_PORT, () => console.log(message))

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'))
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'))
process.on('SIGTERM', exitHandler(0, 'SIGTERM'))
process.on('SIGINT', exitHandler(0, 'SIGINT'))
