import assert from 'assert'
import app from '../../src/app'

describe('\'servient\' service', () => {
  it('registered the service', () => {
    const service = app.service('servient')

    assert.ok(service, 'Registered the service')
  })
})
