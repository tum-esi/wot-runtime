import assert from 'assert'
import app from '../../src/app'

describe('\'srds\' service', () => {
  it('registered the service', () => {
    const service = app.service('srds')

    assert.ok(service, 'Registered the service')
  })
})
