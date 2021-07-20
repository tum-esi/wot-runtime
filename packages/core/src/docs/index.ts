// Options for feathers-swagger docs generator

import { SwaggerInitOptions } from 'feathers-swagger/types'

// https://www.npmjs.com/package/feathers-swagger/v/1.0.0
export const swaggerOptions: SwaggerInitOptions = {
  specs: {
    info: {
      title: 'WoT Runtime',
      description: 'Documentation for wot-runtime',
      version: '1.0.0',
    },
  },
  docsPath: '/openapi',
  openApiVersion: 3,
}
