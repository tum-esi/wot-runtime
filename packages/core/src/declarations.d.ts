import { Application as ExpressFeathers } from '@feathersjs/express'
import * as WoT from 'wot-typescript-definitions'

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {}
// The application instance type that will be used everywhere else
export type Application = ExpressFeathers<ServiceTypes> & { WoT?: WoT.WoT };
