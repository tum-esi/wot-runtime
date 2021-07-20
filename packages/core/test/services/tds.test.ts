import assert from 'assert'
import app from '../../src/app'

describe('\'tds\' service', () => {
  it('registered the service', () => {
    const service = app.service('tds')

    assert.ok(service, 'Registered the service')
  })
})
