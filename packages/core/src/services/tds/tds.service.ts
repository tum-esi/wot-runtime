// Initializes the `tds` service on path `/tds`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Tds } from './tds.class'
import hooks from './tds.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    tds: Tds & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/tds', new Tds(options, app))

  // Get our initialized service so that we can register hooks and add events
  const service = app.service('tds')

  service.hooks(hooks)
}
