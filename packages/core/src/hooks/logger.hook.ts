import logger from '../logger'

// eslint-disable-next-line @typescript-eslint/ban-types
const defaultOptions: object = {}

export async function log(
  ctx: any,
  options: any = defaultOptions
): Promise<void> {
  const skip = ['logs', 'traces']
  if (skip.includes(ctx.path)) return

  const { type, path, method, error, data, params, result, app } = ctx

  let message = `${type}:${path}:${method}`

  if (type === 'error') message += `: ${error.message}`

  logger.debug(message)

  if (error) logger.error(error)

  if (data) logger.verbose(data)

  if (params) logger.verbose(params)

  if (result) logger.verbose(result)
}
