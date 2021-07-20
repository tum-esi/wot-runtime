import logger from './logger'
import app from './app'

const port = process.env.PORT || app.get('port') // handles dynamic port assignment (e.g Heroku)
const server = app.listen(port)

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
)

server.on('listening', () =>
  logger.info(
    'Feathers application started on http://%s:%d',
    app.get('host'),
    port
  )
)

///////////////////////////////// WoT //////////////////////////////////////////

// start WoT Servient in current wot-runtime instance of host (host:port):

const host = `http://${app.get('host')}:${port}`

// start stored servient and update status:
;(async () => {
  // find servient (should return array of one since there is only servient per host):
  const { data } = await app.service('servient').find({ query: { host: host } })

  const servient = data[0]

  const message = `[core/index] Starting WoT Servient for host ${host}`
  logger.info(message)
  app.service('logs').create({ service: 'servient', level: 'info', message })

  // start servient (if it was started already):
  if (['loading', 'running', 'working'].includes(servient.status))
    await app.service('servient').startServient(servient)
})()
