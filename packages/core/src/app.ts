import path from 'path'
import favicon from 'serve-favicon'
import compress from 'compression'
import helmet from 'helmet'
import cors from 'cors'

import feathers from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import express from '@feathersjs/express'
import socketio from '@feathersjs/socketio'

import swagger from 'feathers-swagger'
import { swaggerOptions } from './docs/index'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './docs/openapi.json'

import { Application } from './declarations'
import logger from './logger'
import middleware from './middleware'
import services from './services'
import appHooks from './app.hooks'
import channels from './channels'
import authentication from './authentication'
// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers())

;(app as any).logger = logger

// Load app configuration
app.configure(configuration())
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet())
app.use(cors())
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(app.get('public'), 'favicon.ico')))
// Host the public folder
app.use('/', express.static(app.get('public')))
// app.use("/login", express.static(app.get("public")));
// app.use("/ui", express.static(path.join(__dirname, "../packages/ui/dist")));

// Generates documentation for services
if (process.env.NODE_ENV !== 'production')
  app.configure(swagger(swaggerOptions)) // openapi v3 spec at "/openapi" (not in production)
// Host the auto-generated API docs from openapi.json in swagger-ui
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)) // swagger-ui at "/docs"

// Set up Plugins and providers
app.configure(express.rest())
app.configure(socketio())

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware)
app.configure(authentication)
// Set up our services (see `services/index.js`)
app.configure(services)
// Set up event channels (see channels.js)
app.configure(channels)

// debugger service: exposes "/feathers-debugger" endpoint that can be used
// import debuggerService from "feathers-debugger-service";
// if (process.env.NODE_ENV !== "production")
//   // enable it only on development
//   app.configure(
//     debuggerService({
//       expireAfterSeconds: 900, // [optional] expire item in storage after x seconds, default is 900 (15 minutes)
//       filename: "data/debugger.db", // [optional] filename if you want to persist data in file (uses feathers-nedb)
//     })
//   );

import profiler from 'colorful-feathers-profiler'
app.configure(profiler({ logger, useInProduction: true } as any)) // default: false

// Configure a middleware for 404s and the error handler
app.use(express.notFound())
app.use(express.errorHandler({ logger } as any))

app.hooks(appHooks)

export default app
