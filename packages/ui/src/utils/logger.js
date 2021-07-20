import logger from 'loglevel'
import { ref } from '@vue/composition-api'
import { useAPI } from '@/use/api.js'

// Default log-levels as specified by RFC5424
export const levels = {
  error: 0, // red
  warn: 1, // yellow
  info: 2, // green
  http: 3, // green
  verbose: 4, // cyan
  debug: 5, // blue
  silly: 6 // not shown
}

const skip = ['logs', 'traces']

export function log(context) {
  if (skip.includes(context.path)) return context

  const { type, path, method } = context
  let message = `[wot-runtime/ui] ${context.type}::${context.path}::${context.method}`

  if (context.type === 'error') {
    message += `- ${context.error.message}`
  }

  let json = { level: 'debug', type, path, method, message }

  logger.debug(json)

  if (context.error) {
    json = { ...json, error: context.error }
    logger.error(json)
  }

  if (context.data) {
    json = { ...json, data: context.data }
    logger.trace(json) // traces have "data"
  }

  if (context.params) {
    json = { ...json, params: context.params }
    logger.trace(json) // traces have "params"
  }

  if (context.result) {
    json = { ...json, trace: context.result }
    logger.trace(json) // traces have "result"
  }

  console.log(json)

  const { createItem } = useAPI('Log', ref({}))
  createItem(json, {})
}

export function setLogLevel(level) {
  if (levels.includes(level)) logger.setLevel(level)
}
