'use strict'
import * as WoT from 'wot-typescript-definitions'
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
export class WotMashup {
  public thing: WoT.ExposedThing
  public WoT: WoT.WoT
  public td: any
  public sd: any

  private consumed_things
  private data_pushes

  private mavarCondition1

  private mavarCondition2

  private mavarmyVarXy

  private maproMyThird

  // eslint-disable-next-line no-shadow
  constructor(WoT: WoT.WoT, tdDirectory?: string) {
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

    const tds = [
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

    const consume_promises: Promise<WoT.ConsumedThing>[] = []
    tds.forEach((td) => {
      const TdPromise = WoT.consume(td)
      consume_promises.push(TdPromise)
    })

    Promise.all(consume_promises).then(
      (myTDs) => {
        myTDs.forEach((data) => {
          this.consumed_things[data.getThingDescription().$id.slice(1)] = data
        })

        this.WoT.produce(this.td).then((exposedThing) => {
          this.thing = exposedThing
          this.td = exposedThing.getThingDescription()
          this.add_properties()
          this.add_actions()
          this.add_data_pushes()
          this.thing.expose()
          this.execMashupLogic()
        })
      },
      (err) => {
        throw new Error('cannot consume mashup things Tds ' + err)
      }
    )
  }
  private add_properties() {
    // add property inits and handlers
    this.thing.setPropertyReadHandler(
      'MyThird',
      async () => await this.get_MyThird()
    )
  }

  private add_actions() {
    // add action handlers
    this.thing.setActionHandler('MySecond', (inputData) => {
      return new Promise((resolve, reject) => {
        if (false) {
          reject(new Error('Invalid input'))
        } else {
          // forward inputData here if required
          resolve(this.act_MySecond())
        }
      })
    })
  }

  private oneOf(...inputBool: boolean[]) {
    let hCount = 0
    inputBool.forEach((el) => {
      if (el) {
        hCount++
      }
    })
    return hCount === 1
  }

  private execMashupLogic() {
    return new Promise<any>(async (resolve, reject) => {
      // ### path: ###
      // -- interaction sequence --
      let autoGenReceive2 = this.consumed_things[
        'VirtualCoffeeMachine'
      ].readProperty('state')
      autoGenReceive2 = await autoGenReceive2
      const autoGenWrite0 = this.consumed_things['TestThing'].writeProperty(
        'string'
      )
      await autoGenWrite0
      // -- end intrct seq --
      // set
      this.mavarCondition1 = this.maproMyThird
      if (this.mavarCondition1) {
        // ### path: ###
        // -- interaction sequence --
        this.consumed_things['VirtualCoffeeMachine'].subscribeEvent(
          'maintenance',
          async (autoGenReceive5) => {
            this.data_pushes[0][0] = true
            if (
              Object.keys(this.data_pushes[0]).every((el) => {
                return this.data_pushes[0][el] === true
              })
            ) {
              console.log('data push allOf: ' + autoGenReceive5)
              const autoGenWrite3 = this.consumed_things[
                'TestThing'
              ].writeProperty('string')
              await autoGenWrite3
            }

            if (
              Object.keys(this.data_pushes[0]).every((el) => {
                return this.data_pushes[0][el] === true
              })
            ) {
              Object.keys(this.data_pushes[0]).forEach((el) => {
                this.data_pushes[0][el] = false
              })
            }
          }
        )

        // -- end intrct seq --

        // ### end path ###
      } else {
        // ### path: ###
        // -- interaction sequence --
        this.consumed_things['VirtualCoffeeMachine'].subscribeEvent(
          'error',
          async (autoGenReceive8) => {
            this.data_pushes[1][0] = true
            if (
              Object.keys(this.data_pushes[1]).every((el) => {
                return this.data_pushes[1][el] === true
              })
            ) {
              console.log('data push allOf: ' + autoGenReceive8)
              const autoGenWrite6 = this.consumed_things[
                'TestThing'
              ].writeProperty('string')
              await autoGenWrite6
            }

            if (
              Object.keys(this.data_pushes[1]).every((el) => {
                return this.data_pushes[1][el] === true
              })
            ) {
              Object.keys(this.data_pushes[1]).forEach((el) => {
                this.data_pushes[1][el] = false
              })
            }
          }
        )

        // -- end intrct seq --

        // ### end path ###
      }
      // ref
      this.func_MyFirst()

      // ### end path ###

      resolve()
    })
  }

  private get_MyThird() {
    return new Promise<any>(async (resolve, reject) => {
      // ### path: ###
      // get
      resolve(this.mavarmyVarXy)

      // ### end path ###
      resolve()
    })
  }

  private act_MySecond() {
    return new Promise<any>(async (resolve, reject) => {
      // ### path: ###
      // -- interaction sequence --
      let autoGenReceive11 = this.consumed_things[
        'VirtualCoffeeMachine'
      ].readProperty('state')
      autoGenReceive11 = await autoGenReceive11
      const autoGenWrite9 = this.consumed_things['TestThing'].writeProperty(
        'string'
      )
      await autoGenWrite9
      // -- end intrct seq --

      // ### end path ###
      resolve()
    })
  }

  private func_MyFirst() {
    return new Promise<any>(async (resolve, reject) => {
      // ### path: ###
      if (this.mavarCondition2 === 'asdf') {
        // ### path: ###
        // -- interaction sequence --
        this.consumed_things['VirtualCoffeeMachine'].subscribeEvent(
          'maintenance',
          async (autoGenReceive14) => {
            this.data_pushes[2][0] = true
            if (
              Object.keys(this.data_pushes[2]).every((el) => {
                return this.data_pushes[2][el] === true
              })
            ) {
              console.log('data push allOf: ' + autoGenReceive14)
              const autoGenWrite12 = this.consumed_things[
                'TestThing'
              ].writeProperty('string')
              await autoGenWrite12
            }

            if (
              Object.keys(this.data_pushes[2]).every((el) => {
                return this.data_pushes[2][el] === true
              })
            ) {
              Object.keys(this.data_pushes[2]).forEach((el) => {
                this.data_pushes[2][el] = false
              })
            }
          }
        )

        // -- end intrct seq --

        // ### end path ###
      } else {
        // ### path: ###
        // -- interaction sequence --
        this.consumed_things['VirtualCoffeeMachine'].subscribeEvent(
          'error',
          async (autoGenReceive17) => {
            this.data_pushes[3][0] = true
            if (
              Object.keys(this.data_pushes[3]).every((el) => {
                return this.data_pushes[3][el] === true
              })
            ) {
              console.log('data push allOf: ' + autoGenReceive17)
              const autoGenWrite15 = this.consumed_things[
                'TestThing'
              ].writeProperty('string')
              await autoGenWrite15
            }

            if (
              Object.keys(this.data_pushes[3]).every((el) => {
                return this.data_pushes[3][el] === true
              })
            ) {
              Object.keys(this.data_pushes[3]).forEach((el) => {
                this.data_pushes[3][el] = false
              })
            }
          }
        )

        // -- end intrct seq --

        // ### end path ###
      }
      // ref
      this.act_MySecond()

      // ### end path ###
      resolve()
    })
  }

  private add_data_pushes() {
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
}
