import { SQSD } from './definitions/defs.d'
import {
  interactionType,
  loopType,
  structureType,
  interactionDir,
} from './definitions/enums'

// ------------ Program -------------
/**
 * parses an SD to an tree-like representation
 * @param SD input System Description
 * @returns a tree-like object representing the application logic of the SD
 */
export default function parseSD(SD: SQSD.sdTemplate): SQSD.mashupLogic {
  let root
  const actions = {}
  const functions = {}
  const properties = {}

  if (SD.path && SD.path.length > 0) {
    root = parseRecursion(SD.path)
  }

  if (SD.actions)
    Object.keys(SD.actions).forEach((thisname) => {
      actions[thisname] = parseRecursion(SD.actions[thisname].path)
    })

  if (SD.functions)
    Object.keys(SD.functions).forEach((thisname) => {
      functions[thisname] = parseRecursion(SD.functions[thisname].path)
    })

  if (SD.properties)
    Object.keys(SD.properties).forEach((thisname) => {
      const input = SD.properties[thisname].path
      if (input !== undefined) {
        properties[thisname] = parseRecursion(input)
      }
    })

  const outMashupLogic: SQSD.mashupLogic = {
    root,
    actions,
    functions,
    properties,
    name: SD.title,
  }
  return outMashupLogic
}
// ----------------------------------

/**
 * - parses the content of one `path` to an array of structure elements
 * - each element represents one application logic command
 * - if an element contains further elements (e.g. loop) this function will be called recursively
 * - if an atomic mashup is parsed the functions to parse the interactions will be called
 * @param pathArray the content of a SD `path`-property, a JSON-Array
 */
function parseRecursion(pathArray: SQSD.pathEl[]) {
  const strctProto: SQSD.structureEl[] = []

  pathArray.forEach((pathEl) => {
    const props = Object.getOwnPropertyNames(pathEl)
    const checkP = function (str: string | string[]) {
      if (typeof str === 'string') {
        return props.every((prop) => prop === str)
      } else {
        return props.every((prop) => str.some((strEl) => prop === strEl))
      }
    }

    if (checkP('wait')) {
      pathEl = pathEl as SQSD.pathWait
      strctProto.push({
        type: structureType.wait,
        waitTime: pathEl.wait,
      })
    } else if (checkP('loop')) {
      pathEl = pathEl as SQSD.pathLoop
      let loopOpts: SQSD.loopOptions
      if (pathEl.loop.type === 'logical') {
        loopOpts = {
          type: loopType.logic,
          exCount:
            pathEl.loop.defaultInput === true
              ? 'forever'
              : pathEl.loop.defaultInput,
        }
      } else if (pathEl.loop.defaultInput !== true) {
        loopOpts = {
          type: loopType.timed,
          period: pathEl.loop.defaultInput,
        }
      } else {
        throw new Error('wrong loop options')
      }

      strctProto.push({
        type: structureType.loop,
        content: parseRecursion(pathEl.loop.path),
        loopOpts,
      })
    } else if (checkP('case')) {
      pathEl = pathEl as SQSD.pathCase
      const structIfconv = (inS: SQSD.ifWord) => {
        let outS: SQSD.comparison
        const cprops = Object.keys(inS)
        const checkC = function (str: string | string[]) {
          if (typeof str === 'string') {
            return cprops.every((prop) => prop === str)
          } else {
            return cprops.every((prop) => str.some((strEl) => prop === strEl))
          }
        }

        if (checkC('not')) {
          inS = inS as { not }
          outS = { type: 'not', not: structIfconv(inS.not) }
        } else if (checkC('allOf')) {
          inS = inS as { allOf }
          outS = {
            type: 'all',
            allOf: inS.allOf.map((el) => structIfconv(el)),
          }
        } else if (checkC('oneOf')) {
          inS = inS as { oneOf }
          outS = {
            type: 'one',
            oneOf: inS.oneOf.map((el) => structIfconv(el)),
          }
        } else if (checkC('anyOf')) {
          inS = inS as { anyOf }
          outS = {
            type: 'any',
            anyOf: inS.anyOf.map((el) => structIfconv(el)),
          }
        } else if (checkC(['get', 'output'])) {
          inS = inS as { get; output }
          let value

          if (typeof inS.output === 'object') {
            value = parseVarRef(inS.output)
          } else if (
            typeof inS.output === 'number' ||
            typeof inS.output === 'string'
          ) {
            value = inS.output
          }

          const variable = parseVarRef(inS.get)
          outS = { type: 'var', variable, value }
        } else {
          throw new Error('strange if: ' + cprops)
        }
        return outS
      }

      const condition = structIfconv(pathEl.case.if)
      strctProto.push({
        type: structureType.case,
        content: parseRecursion(pathEl.case.then.path),
        elseContent: pathEl.case.else.path
          ? parseRecursion(pathEl.case.else.path)
          : undefined,
        condition,
      })
    } else if (checkP(['receive', 'send', 'breakOnDataPushed'])) {
      pathEl = pathEl as SQSD.pathInteract
      strctProto.push({
        type: structureType.interact,
        receiveIntrcts: RecPathToIntrct(pathEl.receive),
        sendIntrcts: SendPathToIntrct(pathEl.send),
        breakOnDataPushed: pathEl.breakOnDataPushed ?? false,
      })
    } else if (checkP('get')) {
      pathEl = pathEl as SQSD.pathGet
      strctProto.push({
        type: structureType.get,
        get: parseVarRef(pathEl.get),
      })
    } else if (checkP(['set', 'get', 'defaultInput'])) {
      pathEl = pathEl as SQSD.pathSet
      let get
      let defaultInput
      if (pathEl.get) {
        get = parseVarRef(pathEl.get)
      }
      if (pathEl.defaultInput !== undefined) {
        defaultInput = pathEl.defaultInput
      }
      strctProto.push({
        type: structureType.set,
        set: parseVarRef(pathEl.set),
        get,
        defaultInput,
      })
    } else if (checkP('$ref')) {
      pathEl = pathEl as SQSD.pathRef
      strctProto.push({
        type: structureType.ref,
        ref: parseActRef(pathEl),
      })
    } else {
      console.error('unknown pathType: ' + props)
    }
  })

  return strctProto

  /** helper functions */

  function parseActRef(arg: { $ref: string }) {
    const hIndex = arg.$ref.split('/').slice(1).shift()
    if (!hIndex) {
      throw new Error('case -> act/func fail')
    }

    let type
    if (hIndex === 'functions') {
      type = 'function'
    } else if (hIndex === 'actions') {
      type = 'action'
    } else {
      throw new Error('actRef neither f nor a')
    }
    // remove /path at end of string and get action/function name
    const name = arg.$ref.split('/').slice(0, -1).pop()
    if (name === undefined) {
      throw new Error('cannot get action name')
    }
    return { name, type }
  }
}

/**
 * Parses receiving interactions to internal representation
 * @param inRec JSON-Array containing receiving interactions
 */
function RecPathToIntrct(inRec: SQSD.pathInteractReceive[]) {
  const intrctProto: SQSD.interactionReceive[] = []
  inRec.forEach((inEl) => {
    const direction = interactionDir.receive
    let set
    let type

    // get interaction target (->Thing) by ref and without leading "#"
    const to = inEl.form.$ref.split('/').shift()?.slice(1)
    const name = inEl.form.$ref.split('/').slice(2).shift()
    if (to === undefined || name === undefined) {
      throw new Error('cannot det receive intrct path')
    }

    if (inEl.set) {
      set = parseVarRef(inEl.set)
    }

    if (inEl.op === 'subscribeevent') {
      type = interactionType.subscribe
    } else if (inEl.op === 'invokeaction') {
      type = interactionType.invoke
    } else if (inEl.op === 'observeproperty') {
      type = interactionType.observe
    } else if (inEl.op === 'readproperty') {
      type = interactionType.read
    } else {
      throw new Error('wrong receive op ' + inEl.op)
    }
    intrctProto.push({ direction, type, to, name, set })
  })
  return intrctProto
}

/**
 * Parses sending interactions to internal representation
 * @param inSend JSON-Array containing sending interactions
 */
function SendPathToIntrct(inSend: SQSD.pathInteractSend[]) {
  const intrctProto: SQSD.interactionSend[] = []
  inSend.forEach((inEl) => {
    const direction = interactionDir.send
    let type
    let get
    let defaultInput

    // get interaction target (->Thing) by ref and without leading "#"
    const to = inEl.form.$ref.split('/').shift()?.slice(1)
    const name = inEl.form.$ref.split('/').slice(2).shift()
    if (to === undefined || name === undefined) {
      throw new Error('cannot det receive intrct path')
    }

    if (inEl.get) {
      get = parseVarRef(inEl.get)
    }
    if (inEl.defaultInput !== undefined) {
      defaultInput = inEl.defaultInput
    }

    if (inEl.op === 'invokeaction') {
      type = interactionType.invoke
    } else if (inEl.op === 'writeproperty') {
      type = interactionType.write
    } else {
      throw new Error('wrong send op ' + inEl.op)
    }
    intrctProto.push({ direction, type, to, name, get, defaultInput })
  })
  return intrctProto
}

/**
 * parses the reference string given to internal representation
 * for a variable or property based on {name, type}
 * @param arg object that contains property $ref with a reference string
 */
function parseVarRef(arg: { $ref: string }) {
  const hIndex = arg.$ref.split('/').slice(1).shift()
  if (!hIndex) {
    throw new Error('case -> var/prop fail')
  }

  let type
  if (hIndex === 'variables') {
    type = 'variable'
  } else if (hIndex === 'properties') {
    type = 'property'
  } else {
    throw new Error()
  }
  const name = arg.$ref.split('/').pop()
  if (name === undefined) {
    throw new Error('cannot get property name')
  }
  return { name, type }
}
