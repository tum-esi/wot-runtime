// Initializes the `srds` service on path `/srds`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Srds } from './srds.class'
import hooks from './srds.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    srds: Srds & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/srds', new Srds(options, app)) // e.g. GET /srds?_id=123456
  app.use('/systems/:systemId/srds', new Srds(options, app)) // e.g. GET /systems/123456/srds

  // Get our initialized service so that we can register hooks and add events
  const service = app.service('srds')
  const nestedService = app.service('/systems/:systemId/srds') as Srds &
    ServiceAddons<any>

  // nestedService inherits hooks and handles route params via custom
  // middleware: app.use("/systems/:systemId/:nestedService")
  const nestedHooks = { ...hooks } // can push hooks via nestedHooks.before.all.push((ctx) => ...)
  // Register hooks
  service.hooks(hooks)
  nestedService.hooks(nestedHooks)
}
