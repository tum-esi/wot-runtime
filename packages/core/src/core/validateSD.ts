import Ajv = require('ajv')
import https = require('https')

const ajv = new Ajv({ loadSchema })

// load SD Schema
const schema = import('./definitions/sdSchema.json')

// TODO: throw new Error for invalid SD
export default async function checkSD(
  sdFileContent: string,
  checkRequired = true
): Promise<boolean> {
  if (checkRequired === false) {
    return true
  }
  const SD = JSON.parse(sdFileContent)
  let valid
  ajv.compileAsync(schema).then((validation) => {
    valid = validation(SD)
    if (valid) {
      return true
    } else {
      console.error(
        '!!!???!!! SD Invalid: ' + ajv.errorsText(validation.errors)
      )
    }
  })
  return false
}

function loadSchema(uri: string) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return new Promise<object>((resolve, reject) => {
    https.get(uri, (res) => {
      if (res.statusCode === undefined) {
        throw new Error('https status Code undefined')
      }
      if (res.statusCode >= 400) {
        reject('Loading error: ' + res.statusCode)
      }
      res.setEncoding('utf8')
      let body = ''
      res.on('data', (data) => {
        body += data
      })
      res.on('end', () => {
        resolve(JSON.parse(body))
      })
    })
  })
}
