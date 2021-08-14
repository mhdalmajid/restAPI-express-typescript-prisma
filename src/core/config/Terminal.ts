import { Server } from 'http'

function terminate(server: Server, options = { coredump: false, timeout: 500 }) {
  // Exit function
  const exit = (code: number | undefined) => {
    if (options.coredump) process.abort()
    else process.exit(code)
  }

  return (code: number | undefined, reason: any) => (err: Error | any, promise: any) => {
    if (err && err instanceof Error) {
      // Log error information, use a proper logging library here :)
      console.log(err.message, err.stack)
    }

    // Attempt a graceful shutdown
    server.close()
    setTimeout(exit, options.timeout, code).unref()
  }
}

export default terminate
