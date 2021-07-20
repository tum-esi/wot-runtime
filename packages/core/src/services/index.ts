import { Application } from '../declarations'
import users from './users/users.service'
import logs from './logs/logs.service'
import metrics from './metrics/metrics.service'
import servient from './servient/servient.service'
import things from './things/things.service'
import traces from './traces/traces.service'
import srds from './srds/srds.service'
import tds from './tds/tds.service'
import systems from './systems/systems.service'
import workers from './workers/workers.service'
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users)
  app.configure(logs)
  app.configure(metrics)
  app.configure(servient)
  app.configure(things)
  app.configure(traces)
  app.configure(srds)
  app.configure(tds)
  app.configure(systems)
  app.configure(workers)
}
