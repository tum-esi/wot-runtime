const WotMashup = require('./codeTS').WotMashup
var TD_DIRECTORY = ''
const Servient = require('@node-wot/core').Servient
const HttpServer = require('@node-wot/binding-http').HttpServer
const HttpClientFactory = require('@node-wot/binding-http').HttpClientFactory
var httpServer = new HttpServer({ port: 8080 })
var servient = new Servient()
servient.addServer(httpServer)
servient.addClientFactory(new HttpClientFactory())
servient.start().then(function (WoT) {
  wotMashup = new WotMashup(WoT, TD_DIRECTORY) // you can change the wotDevice (wotMashup) to something that makes more sense
})
