// Application hooks that run for every service
import { setNow } from 'feathers-hooks-common'
import { log } from './hooks/logger.hook'
import { trace } from './hooks/tracer.hook'
// Don't remove this comment. It's needed to format import lines nicely.

export default {
  before: {
    all: [trace, log],
    find: [],
    get: [],
    create: [setNow('createdAt', 'updatedAt')],
    update: [setNow('updatedAt')],
    patch: [],
    remove: [],
  },

  after: {
    all: [log],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [log],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  finally: {
    all: [trace],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
}
