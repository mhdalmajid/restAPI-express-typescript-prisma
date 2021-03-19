import { IS_PROD } from './app'
import { THIRTY_MINUTES } from '../lib/time'

const {
  SESSION_SECRET = 'plkeepethis ase %&this , masecrette',
  SESSION_NAME = 'sid',
  SESSION_IDLE_TIMEOUT = THIRTY_MINUTES,
} = process.env

const SESSION_OPTIONS = {
  cookie: {
    maxAge: +SESSION_IDLE_TIMEOUT,
    secure: IS_PROD,
    sameSite: true,
  },
  secret: SESSION_SECRET,
  name: SESSION_NAME,
  rolling: true,
  resave: false,
  saveUninitialized: false,
}

export { SESSION_OPTIONS }
