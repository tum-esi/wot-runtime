import assert from 'assert'
import app from '../../src/app'

describe('\'traces\' service', () => {
  it('registered the service', () => {
    const service = app.service('traces')

    assert.ok(service, 'Registered the service')
  })
})
