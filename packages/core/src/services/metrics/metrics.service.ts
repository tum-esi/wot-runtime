// Initializes the `metrics` service on path `/metrics`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Metrics } from './metrics.class'
import createModel from '../../models/metrics.model'
import hooks from './metrics.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    metrics: Metrics & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/metrics', new Metrics(options, app)) // e.g. GET /metrics?_systemId=123456
  app.use('/systems/:systemId/metrics', new Metrics(options, app)) // e.g. GET /systems/123456/metrics

  // Get our initialized service so that we can register hooks and add events
  const service = app.service('metrics')
  const nestedService = app.service('/systems/:systemId/metrics') as Metrics &
    ServiceAddons<any>

  // nestedService inherits hooks and handles route params via custom
  // middleware: app.use("/systems/:systemId/:nestedService")
  const nestedHooks = { ...hooks } // can push hooks via nestedHooks.before.all.push((ctx) => ...)
  // Register hooks
  service.hooks(hooks)
  nestedService.hooks(nestedHooks)
}
