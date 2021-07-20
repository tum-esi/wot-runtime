import assert from 'assert'
import app from '../../src/app'

describe('\'logs\' service', () => {
  it('registered the service', () => {
    const service = app.service('logs')

    assert.ok(service, 'Registered the service')
  })
})
