/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Id,
  NullableId,
  Paginated,
  Params,
  ServiceMethods
} from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Worker, WorkerOptions } from 'worker_threads'
// import { spawn, Thread, Worker } from "threads";
import logger from '../../logger'
import { safeJsonParse } from '../../utils'
import { SQSD } from '../../core/definitions/defs'

interface Data {}

interface ServiceOptions {}

interface WorkersInterface {
  [key: string]: Worker
}

interface WorkerMessage {
  op: op
  name: string // name of interaction affordance (property, action or event)
  data: string | Record<string, unknown>
}

type op = [
  'readproperty',
  'writeproperty',
  'observeproperty',
  'unobserveproperty',
  'invokeaction',
  'subscribeevent',
  'unsubscribeevent',
  'readallproperties',
  'writeallproperties',
  'readmultipleproperties',
  'writemultipleproperties'
]

export class Workers {
  app: Application
  options: ServiceOptions
  workers: WorkersInterface

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options
    this.app = app
    this.workers = {}
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    return [this.workers]
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(id: Id, params?: Params): Promise<Data> {
    return this.workers[id]
  }

  async remove(id: Id, params?: Params): Promise<Data> {
    delete this.workers[id]
    console.log('DELETED WORKER', !!this.workers[id])
    return null
  }

  async start(system: any): Promise<void> {
    const { _id, _servientId, code } = system

    // Must parse since NeDB requires storing sd as string (object keys with "$" conflict)
    const sd = (await safeJsonParse(system.sd)) as SQSD.sdTemplate

    if (!code) {
      logger.error('[core/workers] Property "code" is empty or missing.')
      return
    }

    const wrappedCode = this.wrapCode(_id, code)
    // const wrappedCode = code

    if (!this.workers[_id])
      this.workers[_id] = await this.createWorker(_id, wrappedCode)

    const message = `[core/workers] Started system with _id ${_id} on servient with _id ${_servientId}`
    this.app
      .service('logs')
      .create({ service: 'systems', level: 'info', message, _systemId: _id })

    return
  }

  async stop(system: any): Promise<void> {
    const { _id, _servientId } = system

    if (this.workers[_id]) {
      // await Thread.terminate(this.workers[_id]); // using isomorphic 'threads.js'
      await this.workers[_id].terminate() // using vanilla 'worker_threads'
      delete this.workers[_id]
    }

    const message = `[core/workers] Stopped system with _id ${_id} on servient with _id ${_servientId}`
    this.app
      .service('logs')
      .create({ service: 'systems', level: 'info', message, _systemId: _id })

    return
  }

  async createWorker(
    _id: string,
    code: string,
    workerOptions: WorkerOptions = { eval: true }
  ): Promise<Worker> {
    // const worker = await spawn(new Worker(code, workerOptions)); // using isomorphic 'threads.js'
    const worker = new Worker(code, workerOptions) // using vanilla 'worker_threads'
    worker.on('online', async () => {
      logger.info(`[core/workers] started worker thread ${worker.threadId}`)
      worker.on('message', (value: any) =>
        this.handleMessageFromWorker(_id, value)
      )
      worker.on('error', (error: Error) =>
        logger.error(
          `[core/workers] error on worker thread ${worker.threadId}. ${error}`
        )
      )
      worker.on('exit', (exitCode: number) => {
        if (exitCode === 1)
          logger.info(
            `[core/workers] exited worker thread ${worker.threadId} with exitCode 1 (terminated)`
          )
        else
          logger.info(
            `[core/workers] exited worker thread ${worker.threadId} with exitCode ${exitCode}`
          )
      })
      worker.on('messageerror', (error: Error) =>
        logger.error(
          `[core/workers] messageerror on worker thread ${worker.threadId}. ${error}`
        )
      )
    })

    return worker
  }

  wrapCode(_id: string, code: string): string {
    // NOTE: cannot require app form inside (lives in typescript file)
    // e.g. "const app = require(__dirname + './app.js');" or
    // "const wotMashup = new WotMashup(app.WoT)" does not work
    return `const { parentPort } = require("worker_threads");
    const post = (args) => parentPort.postMessage(args);
    console.time("[worker/${_id}] wrap-code");
    ${code} // code from codeGen() algorithm
    console.timeEnd("[worker/${_id}] wrap-code");
    `
  }

  async handleMessageFromWorker(
    _id: string,
    msg: WorkerMessage
  ): Promise<void> {
    const { name = 'logs', op = 'writeproperty', data = {} } = msg
    const srdId = `urn:dev:org:wot-runtime:${_id}`
    const srd = this.app.WoT?.srv?.things.get(srdId)
    logger.info(`[core/worker] Message from worker with id ${_id}:`, msg)

    switch (op) {
      case 'writeproperty':
        return srd.writeProperty(name, data)
      case 'invokeaction':
        return srd.invokeAction(name, data)
      // TODO: repeat for all ops
    }
  }
}
