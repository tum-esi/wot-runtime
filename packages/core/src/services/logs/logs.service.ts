// Initializes the `logs` service on path `/logs`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Logs } from './logs.class'
import createModel from '../../models/logs.model'
import hooks from './logs.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    logs: Logs & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/logs', new Logs(options, app)) // e.g. GET /logs?_systemId=123456
  app.use('/systems/:systemId/logs', new Logs(options, app)) // e.g. GET /systems/123456/logs

  // Get our initialized service so that we can register hooks and add events
  const service = app.service('logs')
  const nestedService = app.service('/systems/:systemId/logs') as Logs &
    ServiceAddons<any>

  // nestedService inherits hooks and handles route params via custom
  // middleware: app.use("/systems/:systemId/:nestedService")
  const nestedHooks = { ...hooks } // can push hooks via nestedHooks.before.all.push((ctx) => ...)
  // Register hooks
  service.hooks(hooks)
  nestedService.hooks(nestedHooks)
}
