// Initializes the `servient` service on path `/servient`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Servient } from './servient.class'
import createModel from '../../models/servient.model'
import hooks from './servient.hooks'
import logger from '../../logger'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    servient: Servient & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/servient', new Servient(options, app))

  // Get our initialized service so that we can register hooks and add events
  const service = app.service('servient')

  service.hooks(hooks)

  service.on('patched', resetSystemsInServient)
}

// event handlers:

const resetSystemsInServient = async (
  servient: any,
  { app }: any
): Promise<void> => {
  const { data: systems } = await app.service('systems').find({
    query: { _hostId: servient._id }
  })

  try {
    // stop or start all systems of servient
    const patchedSystems = await Promise.all(
      systems.map((system: any) =>
        app
          .service('systems')
          .patch(system._id, { ...system, status: servient.status })
      )
    )
    console.log('PATCHED', patchedSystems.length, servient.status)
    if (patchedSystems.length) {
      const substring = servient.status === 'running' ? 'Started' : 'Stopped'
      const message = `[core/servient] ${substring} systems in servient with _id ${servient._id}`
      logger.info(message)
    } else return
  } catch (error) {
    const substring = servient.status === 'running' ? 'starting' : 'stopping'
    const message = `[core/servient] Failed ${substring} systems in servient with _id ${servient._id}`
    logger.error(message)
  }
}
