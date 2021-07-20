/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as authentication from '@feathersjs/authentication'
import { HookContext } from '@feathersjs/feathers'
import { SQSD } from '../../core/definitions/defs'
import {
  getMashupLogic,
  getSeqD,
  getCode,
  transpileTStoJS
} from '../../core/main'
// import * as recast from 'recast'
import { disablePagination } from '../../hooks/disablePagination.hook'
import { safeJsonParse } from '../../utils'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

async function updateSystemProps(ctx: HookContext): Promise<HookContext> {
  const { sd, name } = ctx.data

  // Must parse since NeDB requires storing sd as string (object keys with "$" conflict)
  const sdObject = (await safeJsonParse(sd)) as SQSD.sdTemplate

  // 1) Generate MashupLogic:
  const mashupLogic: SQSD.mashupLogic = await getMashupLogic(sdObject, name)
  ctx.data.mashupLogic = mashupLogic
  // console.log("mashupLogic:", mashupLogic);

  // 2) Generate SeqD:
  const seqD: string = await getSeqD(mashupLogic, name)
  ctx.data.seqD = seqD
  // console.log("seqD:", seqD);

  // 3) Generate TS Code and TS CodeBase:
  const { codeTS, baseTS } = await getCode(sdObject, mashupLogic, name)
  ctx.data.codeTS = codeTS
  ctx.data.baseTS = baseTS
  // console.log("baseTS:", baseTS);

  // 4) Transpile TS Code and TS CodeBase to JS:
  const [code, base] = await Promise.all([
    transpileTStoJS(codeTS, 'CommonJS'),
    transpileTStoJS(baseTS, 'CommonJS')
  ])
  ctx.data.code = code
  ctx.data.base = base

  // 5) Generate AST: this was disabled since it throws parsing errors sometimes
  // ctx.data.ast = recast.parse(code);

  return ctx
}

async function handleStatusChange(ctx: HookContext): Promise<HookContext> {
  const { app, id, data }: any = ctx
  const { status: nextStatus } = data
  const srd = await app.service('srds').get(id)
  switch (nextStatus) {
    case 'idle':
    case 'loading':
      return ctx
    case 'running':
      await app.service('systems').exposeSR(id, srd)
      await app.service('workers').start(data)
      return ctx
    case 'working':
      return ctx
    case 'stopped':
      await app.service('systems').destroySR(id, srd)
      await app.service('workers').stop(data)
      return ctx
    case 'failed':
      await app.service('systems').destroySR(id, srd)
      await app.service('workers').stop(data)
      return ctx
  }
  return ctx
}

const parseSDs = async (ctx: HookContext) => {
  const { result } = ctx
  // handles paginated and not paginated res
  ;((result && result.data) || result).map((system: any) => {
    system.sd = safeJsonParse(system.sd)
  })
}

const parseSD = async (ctx: HookContext): Promise<void> => {
  const { result } = ctx
  if (result.data) result.data.sd = safeJsonParse(result.data.sd)
  else if (result) result.sd = safeJsonParse(result.sd)
}

const stopWorker = async (ctx: HookContext): Promise<HookContext> => {
  await ctx.app.service('workers').stop(ctx.result)
  return ctx
}

const escapeSD = async (ctx: HookContext): Promise<HookContext> => {
  // NOTE: context.data.sd is still of type string (double parsing
  // is somehow required to get it to object, but we cannot store
  // objects in NedB because of conflict with keys starting with "$")
  console.log(ctx.data.sd)
  ctx.data.sd = await JSON.stringify(ctx.data.sd)
  return ctx
}

export default {
  before: {
    all: [
      // authenticate('jwt')
    ],
    find: [disablePagination],
    get: [],
    create: [updateSystemProps, escapeSD],
    update: [updateSystemProps],
    patch: [updateSystemProps],
    remove: []
  },

  after: {
    all: [],
    // find: [parseSDs], // (not needed) return as object
    // get: [parseSD], // (not needed) return as object
    create: [handleStatusChange],
    update: [handleStatusChange],
    patch: [handleStatusChange],
    remove: [stopWorker]
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
