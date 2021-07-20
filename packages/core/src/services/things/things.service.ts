// Initializes the `things` service on path `/things`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Things } from './things.class'
import createModel from '../../models/things.model'
import hooks from './things.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    things: Things & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/things', new Things(options, app))

  // Get our initialized service so that we can register hooks and add events
  const service = app.service('things')

  service.hooks(hooks)
}
