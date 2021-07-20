import {
  Id,
  NullableId,
  Paginated,
  Params,
  ServiceMethods,
} from '@feathersjs/feathers'
import { Application } from '../../declarations'
import srdTemplate from './srd.template.json'

interface Data {}

interface ServiceOptions {}

// runtime-description:

async function generateSrd(
  _id: string,
  title: string,
  baseUrl: string,
  srdTemplateString: string
) {
  // MUST replace possible double quotes in string values before replacement
  title = title.replace(/"/g, '\'')
  baseUrl = baseUrl.replace(/"/g, '\'')
  // ... should do this for all props used below with .replace()

  const srd = srdTemplateString
    .replace(/<title>/, title)
    .replace(/<baseUrl>/g, baseUrl)
    .replace(/<systemRuntimeId>/g, _id)

  return JSON.parse(srd)
}

export class Srds implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options
    this.app = app
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    const { data: srds } = await this.app.service('systems').find(params)
    return Promise.all(srds.map(({ _id }) => this.get(_id, params)))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(id: Id, params?: Params): Promise<Data> {
    const system = await this.app.service('systems').get(id, params)
    const servient = await this.app.service('servient').getServient()
    const { _id, name } = system

    const host = `http://localhost:${servient.config.http.port}`

    const srdTemplateString: string = JSON.stringify(srdTemplate)

    const srd = await generateSrd(_id, name, host, srdTemplateString)

    return srd
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: Data, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return data
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove(id: NullableId, params?: Params): Promise<Data> {
    return { id }
  }
}
