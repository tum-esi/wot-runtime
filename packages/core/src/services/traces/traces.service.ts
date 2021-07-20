// Initializes the `traces` service on path `/traces`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Traces } from './traces.class'
import createModel from '../../models/traces.model'
import hooks from './traces.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    traces: Traces & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/traces', new Traces(options, app)) // e.g. GET /traces?_systemId=123456
  app.use('/systems/:systemId/traces', new Traces(options, app)) // e.g. GET /systems/123456/traces

  // Get our initialized service so that we can register hooks and add events
  const service = app.service('traces')
  const nestedService = app.service('/systems/:systemId/traces') as Traces &
    ServiceAddons<any>

  // nestedService inherits hooks and handles route params via custom
  // middleware: app.use("/systems/:systemId/:nestedService")
  const nestedHooks = { ...hooks } // can push hooks via nestedHooks.before.all.push((ctx) => ...)
  // Register hooks
  service.hooks(hooks)
  nestedService.hooks(nestedHooks)
}
