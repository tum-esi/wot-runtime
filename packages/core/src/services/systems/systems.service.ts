// Initializes the `systems` service on path `/systems`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Systems } from './systems.class'
import createModel from '../../models/systems.model'
import hooks from './systems.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    systems: Systems & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/systems', new Systems(options, app))

  // Get our initialized service so that we can register hooks and add events
  const service = app.service('systems')

  service.hooks(hooks)
}
