import connectRedis from 'connect-redis'
import { promisifyAll } from 'bluebird'
import session from 'express-session'
import redis from 'redis'
import { logger } from './Logger'

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
promisifyAll(redis)

const { createClient } = redis

const { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD } = process.env

const options = {
  port: +REDIS_PORT || 6379,
  host: REDIS_HOST || 'localhost',
  pass: REDIS_PASSWORD || 'secret',
}

/** *****************
 * Redis Initializer
 * for catches and session store
 * ******************
 */
const RedisStore = connectRedis(session)
const client = createClient()
const store = new RedisStore({ ...options, client })

client.on('error', (err) => logger.error(`Redis error:`, err))

client.on('connect', () => logger.info('Connected to Redis'))

export { store }
// export { store, RedisStore, redisClient }
