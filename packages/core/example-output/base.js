const WotMashup = require('./example-output-colorSort.base.js').WotMashup

const TD_DIRECTORY = ''

const Servient = require('@node-wot/core').Servient
const HttpServer = require('@node-wot/binding-http').HttpServer
const HttpClientFactory = require('@node-wot/binding-http').HttpClientFactory

const servient = new Servient()
servient.addServer(new HttpServer({ port: 8080 }))
servient.addClientFactory(new HttpClientFactory())

servient.start().then((WoT) => {
  const wotMashup = new WotMashup(WoT, TD_DIRECTORY)
})
