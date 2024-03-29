import express from 'express'
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'
import methodOverride from 'method-override'
import morgan from 'morgan'
import cors from 'cors'
import { VersionCheckMiddleware } from '../middlewares/VersionCheckMiddleware'
import { createAuthc } from '../authentication'
import { env } from '../env'
import { configureStandalone } from './standalone'

const app = express()

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
}
app.use(morgan('combined'))
app.use(methodOverride())
app.use(cookieParser())

app.use(
  expressSession({
    name: 'app-gateway',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production'
    }
  })
)
app.use(express.urlencoded({ extended: true }))
const authc = createAuthc(app)

const API_ALLOWED_DOMAINS = env.GATEWAY_API_ALLOWED_DOMAINS

const whitelist = API_ALLOWED_DOMAINS.split(/\s+/)
const corsOptions = {
  origin: (origin, callback) => {
    // !origin will allow Postman calls
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      console.error(`Invalid origin ${origin} detected!`)
      callback(new Error('Invalid origin detected!'))
    }
  }
}
app.use(cors(corsOptions))
if (env.APP_DEPLOY_MODE !== 'standalone') {
  app.use(VersionCheckMiddleware)
}

configureStandalone(app)

export { app, authc }
