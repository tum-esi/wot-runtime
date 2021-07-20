// Initializes the `workers` service on path `/workers`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Workers } from './workers.class'
import hooks from './workers.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'workers': Workers & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/workers', new Workers(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('workers')

  service.hooks(hooks)
}
