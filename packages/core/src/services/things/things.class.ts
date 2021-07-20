import { Service, NedbServiceOptions } from 'feathers-nedb'
import { Application } from '../../declarations'

export class Things extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<NedbServiceOptions>, app: Application) {
    super(options)
  }
}
