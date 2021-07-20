import { Service, NedbServiceOptions } from 'feathers-nedb'
import { Application } from '../../declarations'
import { Servient as WoTServient } from '@node-wot/core'
import { HttpServer } from '@node-wot/binding-http'
import { CoapServer } from '@node-wot/binding-coap'
// import { MqttBrokerServer } from "@node-wot/binding-mqtt";
import logger from '../../logger'

const DEFAULT_CONFIG = {
  http: {
    port: 8080,
    proxy: {
      href: 'http://localhost:8080',
      scheme: 'basic',
      token: 'bearerToken',
      username: 'username',
      password: 'password'
    },
    allowSelfSigned: true
  },
  coap: {
    port: 5683
  },
  mqtt: {
    broker: 'mqtt://test.mosquitto.org',
    username: 'username',
    password: 'password',
    clientId: 'uniqueId',
    port: 1883
  },
  credentials: {
    'thing-id': {
      username: 'username',
      password: 'password'
    },
    'other-thing-id': {
      identity: 'identity',
      psk: 'psk'
    },
    'nth-thing-id': {
      token: 'token'
    }
  }
}

interface Data {}

export class Servient extends Service {
  app: Application

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<NedbServiceOptions>, app: Application) {
    super(options)
    this.app = app
  }

  // utilit function to get single servient in database (without having to specify id nor params)
  async getServient(): Promise<any> {
    const { data } = await this.find()
    const servientInHost = data[0]
    return servientInHost
  }

  async startServient(servient: any): Promise<any> {
    const host = `http://${this.app.get('host')}:${this.app.get('port')}`

    if (!this.app.WoT) {
      let status
      try {
        const WoT = (await this.createServient(servient.config)) as any
        logger.info(`[core/servient] Created servient on host ${host}`)
        console.log(WoT)
        this.app.WoT = WoT
        status = 'running'
        const message = `[core/servient] Started servient on host ${host}`
        logger.info(message)
      } catch (error) {
        status = 'failed'
        const message = `[core/servient] Failed to create servient on host ${host}. ${error}`
        logger.error(message)
        throw new Error(message)
      } finally {
        return this.app.service('servient').patch(servient._id, { status })
      }
    }
  }

  async createServient(config = DEFAULT_CONFIG): Promise<any> {
    const servient = new WoTServient()
    if (config.http) servient.addServer(new HttpServer(config.http as any))
    if (config.coap) servient.addServer(new CoapServer(config.coap as any))
    // if (config.mqtt) servient.addServer(new MqttBrokerServer(config.mqtt));
    // if (config.credentials) servient.addCredentials(config.credentials);

    try {
      const wot = await servient.start() // wot object exposes consume, produce, srv, ...
      return wot
    } catch (error) {
      throw new Error(error)
    }
  }

  async shutdownServient(app: Application, servient: any): Promise<any> {
    logger.info(`Shut-down servient with _id ${servient._id}`)
    const host = `http://${this.app.get('host')}:${this.app.get('port')}`

    if (this.app.WoT) {
      let status
      try {
        await this.app.WoT.srv.shutdown()
        delete this.app.WoT
        status = 'stopped'
        const message = `[core/servient] Shut-down servient with _id ${servient._id} on host ${host}`
        logger.info(message)
      } catch (error) {
        status = 'failed'
        const message = `[core/servient] Failed to shut-down servient with _id ${servient._id} on host ${host}. ${error}`
        logger.error(message)
        throw new Error(message)
      } finally {
        return this.app.service('servient').patch(servient._id, { status })
      }
    }
  }
}
