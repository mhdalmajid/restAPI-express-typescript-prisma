import { IMidware } from '@core/types'
import { RequestHandler, Request, Response, NextFunction } from 'express'

/**

 * Wrapper for async express route for properly catches thrown exceptions
 *
 * Wraps the express route in a function that passes the `next` method
 * from the route to the promise's catch statement
 * which allows the middleware to catch the exception
 *
 * @param {RequestHandler} fn The Express function to wrap
 * @returns {Function} The wrapped function
 * @see {@link https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/#usinges7asyncawait}
 *
 * @example
 *
 * ```ts
 * import wrapper from 'asyncWrapper'
 *
 * //...
 *
 * app.get('/foo', asyncWrapper(someAsyncRouteFunction))
 * ```
 */
type asyncWrap = (fn: IMidware) => (...fn: [Request, Response, NextFunction]) => Promise<any>

export const wrap: asyncWrap =
  (fn) =>
  (...args) =>
    fn(...args).catch(args[2])
