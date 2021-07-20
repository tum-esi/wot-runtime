// import * as authentication from '@feathersjs/authentication'
// Don't remove this comment. It's needed to format import lines nicely.

// const { authenticate } = authentication.hooks

async function timestampToNumber(ctx: any) {
  if (ctx?.params?.query?.ts?.$gt) {
    ctx.params.query.ts.$gt = Number(ctx.params.query.ts.$gt) // Convert ts[$gt] to number
  }
}

import { disablePagination } from '../../hooks/disablePagination.hook'

export default {
  before: {
    all: [
      // authenticate("jwt")
      timestampToNumber
    ],
    find: [disablePagination],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [
      async (ctx: any) => {
        await ctx.app('traces').remove({}, { multi: true })
        ctx.result = { success: true }
      }
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
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
