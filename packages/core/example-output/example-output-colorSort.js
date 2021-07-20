'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this
        }),
      g
    )
    function verb(n) {
      return function (v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.')
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.WotMashup = void 0
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
var WotMashup = /** @class */ (function () {
  // eslint-disable-next-line no-shadow
  function WotMashup(WoT, tdDirectory) {
    var _this = this
    // create WotDevice as a server
    this.WoT = WoT
    this.consumed_things = {}
    this.data_pushes = {}
    this.td = {
      '@context': [
        'https://www.w3.org/2019/wot/td/v1',
        {
          '@language': 'en'
        }
      ],
      id: 'de:tum:ei:esi:MashDE:VirtualCoffeeMachineTestThing:',
      '@type': 'Thing',
      title: 'conditionalExecution',
      description: 'a mashup generated with MashDE',
      securityDefinitions: {
        nosec_sc: {
          scheme: 'nosec'
        }
      },
      security: 'nosec_sc',
      properties: {
        MyThird: {
          forms: [
            {
              href: 'example://properties/MyThird'
            }
          ]
        }
      },
      actions: {
        MySecond: {
          forms: [
            {
              href: 'example://actions/MySecond'
            }
          ]
        }
      },
      events: {}
    }
    this.sd = {
      '@context': [
        'https://www.w3.org/2019/wot/td/v1',
        {
          '@language': 'en'
        }
      ],
      id: 'de:tum:ei:esi:MashDE:VirtualCoffeeMachineTestThing:',
      '@type': 'Thing',
      title: 'conditionalExecution',
      description: 'a mashup generated with MashDE',
      securityDefinitions: {
        nosec_sc: {
          scheme: 'nosec'
        }
      },
      security: 'nosec_sc',
      things: {
        VirtualCoffeeMachine: {
          $id: '#VirtualCoffeeMachine',
          base: 'example://-',
          properties: {
            state: {
              forms: [
                {
                  href:
                    'http://127.0.0.1:80/VirtualCoffeeMachine/properties/state',
                  contentType: 'application/json',
                  op: 'readproperty'
                }
              ]
            }
          },
          actions: {},
          events: {
            maintenance: {
              forms: [
                {
                  href:
                    'http://127.0.0.1:80/VirtualCoffeeMachine/events/maintenance',
                  contentType: 'application/json',
                  subprotocol: 'longpoll',
                  op: 'subscribeevent'
                }
              ]
            },
            error: {
              forms: [
                {
                  href: 'http://127.0.0.1:80/VirtualCoffeeMachine/events/error',
                  contentType: 'application/json',
                  subprotocol: 'longpoll',
                  op: 'subscribeevent'
                }
              ]
            }
          },
          title: 'VirtualCoffeeMachine'
        },
        TestThing: {
          $id: '#TestThing',
          base: 'example://-',
          properties: {
            string: {
              forms: [
                {
                  href:
                    'http://plugfest.thingweb.io:8083/TestThing/properties/string',
                  contentType: 'application/json',
                  op: 'writeproperty'
                }
              ]
            }
          },
          actions: {},
          events: {},
          title: 'TestThing'
        }
      },
      variables: {
        Condition1: {},
        Condition2: {
          type: 'boolean'
        },
        myVarXy: {}
      },
      properties: {
        MyThird: {
          forms: [
            {
              href: 'example://properties/MyThird'
            }
          ],
          path: [
            {
              get: {
                $ref: '#/variables/myVarXy'
              }
            }
          ]
        }
      },
      actions: {
        MySecond: {
          forms: [
            {
              href: 'example://actions/MySecond'
            }
          ],
          path: [
            {
              receive: [
                {
                  form: {
                    $ref: '#VirtualCoffeeMachine/properties/state/forms/0'
                  },
                  op: 'readproperty'
                }
              ],
              send: [
                {
                  form: {
                    $ref: '#TestThing/properties/string/forms/0'
                  },
                  op: 'writeproperty'
                }
              ],
              breakOnDataPushed: false
            }
          ]
        }
      },
      functions: {
        MyFirst: {
          forms: [
            {
              href: 'example://functions/MyFirst'
            }
          ],
          path: [
            {
              case: {
                if: {
                  get: {
                    $ref: '#/variables/Condition2'
                  },
                  output: 'asdf'
                },
                then: {
                  path: [
                    {
                      receive: [
                        {
                          form: {
                            $ref:
                              '#VirtualCoffeeMachine/events/maintenance/forms/0'
                          },
                          op: 'subscribeevent'
                        }
                      ],
                      send: [
                        {
                          form: {
                            $ref: '#TestThing/properties/string/forms/0'
                          },
                          op: 'writeproperty'
                        }
                      ],
                      breakOnDataPushed: false
                    }
                  ]
                },
                else: {
                  path: [
                    {
                      receive: [
                        {
                          form: {
                            $ref: '#VirtualCoffeeMachine/events/error/forms/0'
                          },
                          op: 'subscribeevent'
                        }
                      ],
                      send: [
                        {
                          form: {
                            $ref: '#TestThing/properties/string/forms/0'
                          },
                          op: 'writeproperty'
                        }
                      ],
                      breakOnDataPushed: false
                    }
                  ]
                }
              }
            },
            {
              $ref: '#/actions/MySecond/path'
            }
          ]
        }
      },
      events: {},
      path: [
        {
          receive: [
            {
              form: {
                $ref: '#VirtualCoffeeMachine/properties/state/forms/0'
              },
              op: 'readproperty'
            }
          ],
          send: [
            {
              form: {
                $ref: '#TestThing/properties/string/forms/0'
              },
              op: 'writeproperty'
            }
          ],
          breakOnDataPushed: false
        },
        {
          set: {
            $ref: '#/variables/Condition1'
          },
          get: {
            $ref: '#/properties/MyThird'
          }
        },
        {
          case: {
            if: {
              get: {
                $ref: '#/variables/Condition1'
              }
            },
            then: {
              path: [
                {
                  receive: [
                    {
                      form: {
                        $ref: '#VirtualCoffeeMachine/events/maintenance/forms/0'
                      },
                      op: 'subscribeevent'
                    }
                  ],
                  send: [
                    {
                      form: {
                        $ref: '#TestThing/properties/string/forms/0'
                      },
                      op: 'writeproperty'
                    }
                  ],
                  breakOnDataPushed: false
                }
              ]
            },
            else: {
              path: [
                {
                  receive: [
                    {
                      form: {
                        $ref: '#VirtualCoffeeMachine/events/error/forms/0'
                      },
                      op: 'subscribeevent'
                    }
                  ],
                  send: [
                    {
                      form: {
                        $ref: '#TestThing/properties/string/forms/0'
                      },
                      op: 'writeproperty'
                    }
                  ],
                  breakOnDataPushed: false
                }
              ]
            }
          }
        },
        {
          $ref: '#/functions/MyFirst/path'
        }
      ]
    }
    var tds = [
      {
        $id: '#VirtualCoffeeMachine',
        base: 'example://-',
        properties: {
          state: {
            forms: [
              {
                href:
                  'http://127.0.0.1:80/VirtualCoffeeMachine/properties/state',
                contentType: 'application/json',
                op: 'readproperty'
              }
            ]
          }
        },
        actions: {},
        events: {
          maintenance: {
            forms: [
              {
                href:
                  'http://127.0.0.1:80/VirtualCoffeeMachine/events/maintenance',
                contentType: 'application/json',
                subprotocol: 'longpoll',
                op: 'subscribeevent'
              }
            ]
          },
          error: {
            forms: [
              {
                href: 'http://127.0.0.1:80/VirtualCoffeeMachine/events/error',
                contentType: 'application/json',
                subprotocol: 'longpoll',
                op: 'subscribeevent'
              }
            ]
          }
        },
        title: 'VirtualCoffeeMachine'
      },
      {
        $id: '#TestThing',
        base: 'example://-',
        properties: {
          string: {
            forms: [
              {
                href:
                  'http://plugfest.thingweb.io:8083/TestThing/properties/string',
                contentType: 'application/json',
                op: 'writeproperty'
              }
            ]
          }
        },
        actions: {},
        events: {},
        title: 'TestThing'
      }
    ]
    var consume_promises = []
    tds.forEach(function (td) {
      var TdPromise = WoT.consume(td)
      consume_promises.push(TdPromise)
    })
    Promise.all(consume_promises).then(
      function (myTDs) {
        myTDs.forEach(function (data) {
          _this.consumed_things[data.getThingDescription().$id.slice(1)] = data
        })
        _this.WoT.produce(_this.td).then(function (exposedThing) {
          _this.thing = exposedThing
          _this.td = exposedThing.getThingDescription()
          _this.add_properties()
          _this.add_actions()
          _this.add_data_pushes()
          _this.thing.expose()
          _this.execMashupLogic()
        })
      },
      function (err) {
        throw new Error('cannot consume mashup things Tds ' + err)
      }
    )
  }
  WotMashup.prototype.add_properties = function () {
    var _this = this
    // add property inits and handlers
    this.thing.setPropertyReadHandler('MyThird', function () {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4 /*yield*/, this.get_MyThird()]
            case 1:
              return [2 /*return*/, _a.sent()]
          }
        })
      })
    })
  }
  WotMashup.prototype.add_actions = function () {
    var _this = this
    // add action handlers
    this.thing.setActionHandler('MySecond', function (inputData) {
      return new Promise(function (resolve, reject) {
        if (false) {
          reject(new Error('Invalid input'))
        } else {
          // forward inputData here if required
          resolve(_this.act_MySecond())
        }
      })
    })
  }
  WotMashup.prototype.oneOf = function () {
    var inputBool = []
    for (var _i = 0; _i < arguments.length; _i++) {
      inputBool[_i] = arguments[_i]
    }
    var hCount = 0
    inputBool.forEach(function (el) {
      if (el) {
        hCount++
      }
    })
    return hCount === 1
  }
  WotMashup.prototype.execMashupLogic = function () {
    var _this = this
    return new Promise(function (resolve, reject) {
      return __awaiter(_this, void 0, void 0, function () {
        var autoGenReceive2, autoGenWrite0
        var _this = this
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              autoGenReceive2 = this.consumed_things[
                'VirtualCoffeeMachine'
              ].readProperty('state')
              return [4 /*yield*/, autoGenReceive2]
            case 1:
              autoGenReceive2 = _a.sent()
              autoGenWrite0 = this.consumed_things['TestThing'].writeProperty(
                'string'
              )
              return [
                4 /*yield*/,
                autoGenWrite0
                // -- end intrct seq --
                // set
              ]
            case 2:
              _a.sent()
              // -- end intrct seq --
              // set
              this.mavarCondition1 = this.maproMyThird
              if (this.mavarCondition1) {
                // ### path: ###
                // -- interaction sequence --
                this.consumed_things['VirtualCoffeeMachine'].subscribeEvent(
                  'maintenance',
                  function (autoGenReceive5) {
                    return __awaiter(_this, void 0, void 0, function () {
                      var autoGenWrite3
                      var _this = this
                      return __generator(this, function (_a) {
                        switch (_a.label) {
                          case 0:
                            this.data_pushes[0][0] = true
                            if (
                              !Object.keys(this.data_pushes[0]).every(function (
                                el
                              ) {
                                return _this.data_pushes[0][el] === true
                              })
                            )
                              return [3 /*break*/, 2]
                            console.log('data push allOf: ' + autoGenReceive5)
                            autoGenWrite3 = this.consumed_things[
                              'TestThing'
                            ].writeProperty('string')
                            return [4 /*yield*/, autoGenWrite3]
                          case 1:
                            _a.sent()
                            _a.label = 2
                          case 2:
                            if (
                              Object.keys(this.data_pushes[0]).every(function (
                                el
                              ) {
                                return _this.data_pushes[0][el] === true
                              })
                            ) {
                              Object.keys(this.data_pushes[0]).forEach(
                                function (el) {
                                  _this.data_pushes[0][el] = false
                                }
                              )
                            }
                            return [2 /*return*/]
                        }
                      })
                    })
                  }
                )
                // -- end intrct seq --
                // ### end path ###
              } else {
                // ### path: ###
                // -- interaction sequence --
                this.consumed_things['VirtualCoffeeMachine'].subscribeEvent(
                  'error',
                  function (autoGenReceive8) {
                    return __awaiter(_this, void 0, void 0, function () {
                      var autoGenWrite6
                      var _this = this
                      return __generator(this, function (_a) {
                        switch (_a.label) {
                          case 0:
                            this.data_pushes[1][0] = true
                            if (
                              !Object.keys(this.data_pushes[1]).every(function (
                                el
                              ) {
                                return _this.data_pushes[1][el] === true
                              })
                            )
                              return [3 /*break*/, 2]
                            console.log('data push allOf: ' + autoGenReceive8)
                            autoGenWrite6 = this.consumed_things[
                              'TestThing'
                            ].writeProperty('string')
                            return [4 /*yield*/, autoGenWrite6]
                          case 1:
                            _a.sent()
                            _a.label = 2
                          case 2:
                            if (
                              Object.keys(this.data_pushes[1]).every(function (
                                el
                              ) {
                                return _this.data_pushes[1][el] === true
                              })
                            ) {
                              Object.keys(this.data_pushes[1]).forEach(
                                function (el) {
                                  _this.data_pushes[1][el] = false
                                }
                              )
                            }
                            return [2 /*return*/]
                        }
                      })
                    })
                  }
                )
                // -- end intrct seq --
                // ### end path ###
              }
              // ref
              this.func_MyFirst()
              // ### end path ###
              resolve()
              return [2 /*return*/]
          }
        })
      })
    })
  }
  WotMashup.prototype.get_MyThird = function () {
    var _this = this
    return new Promise(function (resolve, reject) {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          // ### path: ###
          // get
          resolve(this.mavarmyVarXy)
          // ### end path ###
          resolve()
          return [2 /*return*/]
        })
      })
    })
  }
  WotMashup.prototype.act_MySecond = function () {
    var _this = this
    return new Promise(function (resolve, reject) {
      return __awaiter(_this, void 0, void 0, function () {
        var autoGenReceive11, autoGenWrite9
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              autoGenReceive11 = this.consumed_things[
                'VirtualCoffeeMachine'
              ].readProperty('state')
              return [4 /*yield*/, autoGenReceive11]
            case 1:
              autoGenReceive11 = _a.sent()
              autoGenWrite9 = this.consumed_things['TestThing'].writeProperty(
                'string'
              )
              return [
                4 /*yield*/,
                autoGenWrite9
                // -- end intrct seq --
                // ### end path ###
              ]
            case 2:
              _a.sent()
              // -- end intrct seq --
              // ### end path ###
              resolve()
              return [2 /*return*/]
          }
        })
      })
    })
  }
  WotMashup.prototype.func_MyFirst = function () {
    console.log('func_MyFirst')

    var _this = this
    return new Promise(function (resolve, reject) {
      return __awaiter(_this, void 0, void 0, function () {
        var _this = this
        return __generator(this, function (_a) {
          // ### path: ###
          if (this.mavarCondition2 === 'asdf') {
            // ### path: ###
            // -- interaction sequence --
            this.consumed_things['VirtualCoffeeMachine'].subscribeEvent(
              'maintenance',
              function (autoGenReceive14) {
                return __awaiter(_this, void 0, void 0, function () {
                  var autoGenWrite12
                  var _this = this
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        this.data_pushes[2][0] = true
                        if (
                          !Object.keys(this.data_pushes[2]).every(function (
                            el
                          ) {
                            return _this.data_pushes[2][el] === true
                          })
                        )
                          return [3 /*break*/, 2]
                        console.log('data push allOf: ' + autoGenReceive14)
                        autoGenWrite12 = this.consumed_things[
                          'TestThing'
                        ].writeProperty('string')
                        return [4 /*yield*/, autoGenWrite12]
                      case 1:
                        _a.sent()
                        _a.label = 2
                      case 2:
                        if (
                          Object.keys(this.data_pushes[2]).every(function (el) {
                            return _this.data_pushes[2][el] === true
                          })
                        ) {
                          Object.keys(this.data_pushes[2]).forEach(function (
                            el
                          ) {
                            _this.data_pushes[2][el] = false
                          })
                        }
                        return [2 /*return*/]
                    }
                  })
                })
              }
            )
            // -- end intrct seq --
            // ### end path ###
          } else {
            // ### path: ###
            // -- interaction sequence --
            this.consumed_things['VirtualCoffeeMachine'].subscribeEvent(
              'error',
              function (autoGenReceive17) {
                return __awaiter(_this, void 0, void 0, function () {
                  var autoGenWrite15
                  var _this = this
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        this.data_pushes[3][0] = true
                        if (
                          !Object.keys(this.data_pushes[3]).every(function (
                            el
                          ) {
                            return _this.data_pushes[3][el] === true
                          })
                        )
                          return [3 /*break*/, 2]
                        console.log('data push allOf: ' + autoGenReceive17)
                        autoGenWrite15 = this.consumed_things[
                          'TestThing'
                        ].writeProperty('string')
                        return [4 /*yield*/, autoGenWrite15]
                      case 1:
                        _a.sent()
                        _a.label = 2
                      case 2:
                        if (
                          Object.keys(this.data_pushes[3]).every(function (el) {
                            return _this.data_pushes[3][el] === true
                          })
                        ) {
                          Object.keys(this.data_pushes[3]).forEach(function (
                            el
                          ) {
                            _this.data_pushes[3][el] = false
                          })
                        }
                        return [2 /*return*/]
                    }
                  })
                })
              }
            )
            // -- end intrct seq --
            // ### end path ###
          }
          // ref
          this.act_MySecond()
          // ### end path ###
          resolve()
          return [2 /*return*/]
        })
      })
    })
  }
  WotMashup.prototype.add_data_pushes = function () {
    // add helper object for data pushes
    this.data_pushes[0] = {}
    this.data_pushes[0][0] = false
    this.data_pushes[1] = {}
    this.data_pushes[1][0] = false
    this.data_pushes[2] = {}
    this.data_pushes[2][0] = false
    this.data_pushes[3] = {}
    this.data_pushes[3][0] = false
  }
  return WotMashup
})()
exports.WotMashup = WotMashup
