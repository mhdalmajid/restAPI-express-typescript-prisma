import http from 'http'
import { appListeningLogger, logger } from 'src/lib/Logger'
import { PrismaClient } from '@prisma/client'
import AppInit from './app'
import terminate from './lib/Terminal'

// todo: options for cors , sendgrid api ,express-rate-limit ,HPP,lusca,csurf

// const prisma = new PrismaClient()

/** *****************
 * EXPRESS Initializer
 *  will create express app
 * ******************
 */
const app = AppInit()

const server = http.createServer(app)

server.listen(process.env.APP_PORT, appListeningLogger)

// I want to enable core dumps, as well as the timeout.
// I usually use an environment variable to control when I want to enable a core dump.
// I enable them only when I am going to do some performance testing on my application or whenever
// I want to replicate the error.
const exitHandler = terminate(server, {
  coredump: false,
  timeout: 500,
})

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'))
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'))
process.on('SIGTERM', exitHandler(0, 'SIGTERM'))
process.on('SIGINT', exitHandler(0, 'SIGINT'))
