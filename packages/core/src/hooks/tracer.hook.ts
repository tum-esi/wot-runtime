// setting to true might crash because of keys with $
import logger from '../logger'
const defaultOptions = {
  captureParams: false,
  captureResult: false,
  captureQuery: false,
}

// this hook creates a trace for
export async function trace(
  ctx: any,
  options: any = defaultOptions
): Promise<void> {
  const service = ctx.app.service('traces')

  // Error Message if service is not registered
  if (!service) {
    logger.warn('[api/hooks] \'traces\' service is not registered in app')
    return
  }
  if (ctx.path === 'traces') return

  if (!ctx._req_ts) {
    ctx._req_ts = Date.now()
  } else {
    ctx._req_duration = Date.now() - ctx._req_ts
  }

  const payload: any = {
    id: ctx._req_id,
    path: options.path || ctx.path,
    type: ctx.type,
    method: ctx.method,
    provider: ctx.params ? ctx.params.provider : undefined,
    ts: ctx._req_ts,
    duration: ctx._req_duration,
    data: ctx.data, // throws error since SD and TD have $ in field names (not allowed in NeDB)
    error: ctx.error ? ctx.error.message : undefined,
    end: Date.now(),
  }

  if (options.captureParams) payload.result = ctx.result
  if (options.captureResult) payload.params = ctx.params
  if (options.captureQuery) payload.query = ctx.params.query

  try {
    if (payload.duration) await service.create(payload)
  } finally {
    return ctx
  }
}
