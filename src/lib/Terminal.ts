import { logger } from 'src/lib/Logger'
import { Server } from 'http'

function terminate(server: Server, options = { coredump: false, timeout: 500 }) {
  // Exit function
  const exit = (code: any) => (options.coredump ? process.abort() : process.exit(code))

  return (code: number, reason: string) => (err: Error, promise: unknown) => {
    if (err && err instanceof Error) {
      // Log error information, use a proper logging library here :)
      logger.error(err.message, err.stack)
    }

    // Attempt a graceful shutdown
    server.close(exit)
    setTimeout(exit, options.timeout).unref()
  }
}

export default terminate
