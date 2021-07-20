// import * as authentication from '@feathersjs/authentication'
// Don't remove this comment. It's needed to format import lines nicely.

// const { authenticate } = authentication.hooks

import { disablePagination } from '../../hooks/disablePagination.hook'

export default {
  before: {
    all: [
      // authenticate("jwt")
    ],
    find: [disablePagination],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
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
