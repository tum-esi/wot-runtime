// import * as authentication from '@feathersjs/authentication'
import { HookContext } from '@feathersjs/feathers'
// Don't remove this comment. It's needed to format import lines nicely.

// const { authenticate } = authentication.hooks

async function handleStatusChange(ctx: HookContext): Promise<HookContext> {
  const { status: nextStatus } = ctx.data
  switch (nextStatus) {
    case 'idle':
      return ctx
    case 'loading':
      return ctx
    case 'running':
      await start(ctx)
      return ctx
    case 'working':
      return ctx
    case 'stopped':
      await stop(ctx)
      return ctx
    case 'failed':
      await stop(ctx)
      return ctx
    default:
      return ctx
  }
}

async function start(ctx: any) {
  const id = ctx.id || ctx.data._id // gets from data if run in after hook

  await ctx.app.service('servient').startServient({ ...ctx.data, _id: id }) // adds id

  const host = `http://${ctx.app.get('host')}:${ctx.app.get('port')}`
  const message = `[core/servient] Started servient with _id ${id} on host ${host}`
  ctx.app
    .service('logs')
    .create({ service: 'servient', level: 'info', message })
  return ctx
}

async function stop(ctx: any) {
  const id = ctx.id || ctx.data._id // gets from data if run in after hook

  await ctx.app
    .service('servient')
    .shutdownServient(ctx.app, { ...ctx.data, _id: id }) // adds id

  const host = `http://${ctx.app.get('host')}:${ctx.app.get('port')}`
  const message = `[core/servient] Stopped servient with _id ${id} on host ${host}`
  ctx.app
    .service('logs')
    .create({ service: 'servient', level: 'info', message })
  return ctx
}

// populates:

import app from '../../app'
import { fastJoin } from 'feathers-hooks-common'
const servientResolvers = {
  joins: {
    totalSystems: () => async (servient: any) => {
      servient.totalSystems = await app
        .service('systems')
        .find({ query: { _servientId: servient._id }, $limit: 0 })
        .then((pageObj) => pageObj.total)
    }
  }
}

const query = { totalSystems: true } // activates/deactivates resolvers

export default {
  before: {
    all: [
      // authenticate('jwt'),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [fastJoin(servientResolvers, query)],
    find: [],
    get: [],
    create: [handleStatusChange],
    update: [handleStatusChange],
    patch: [handleStatusChange],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  finally: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
